const User = require('../model/user');
const Item = require('../model/item');

const getAllItems = async (req, res) => {
    try{
        let items = await Item.findAll({
            raw:true,
            include: [
                {
                    model: User,
                    required: true,
                }
            ]
        });
        for (let i = 0; i<items.length; i++){
            items[i].user = {
                id: items[i]['user.id'],
                name: items[i]['user.name'],
                email: items[i]['user.email'],
                phone: items[i]['user.phone']
            };
            delete items[i]['user.id'];
            delete items[i]['user.name'];
            delete items[i]['user.email'];
            delete items[i]['user.phone'];
            delete items[i]['user.password'];
        }
        res.send(`<pre>${JSON.stringify(items, null, 4)}</pre>`)
    }
    catch (e) {
        res.status(500).send(e);
    }
};
const createItem = async (req, res) => {
    if(req.body.title.length === 0){
        return res.status(422).send({
            field:'title',
            message:'Title is required'
        });
    }
    if(req.body.price.length === 0){
        return res.status(422).send({
            field:'price',
            message:'Price is required'
        });
    }
    try {
        const {password, ...userWithoutPassword} = req.user;
        let {dataValues: item} = await Item.create({
            title: req.body.title,
            price: +req.body.price,
            user_id: req.user.id
        });
        res.send({...item, user: userWithoutPassword})
    }
    catch (e) {
        res.status(500).send(e);
    }
};
const getItemById = async (req, res) => {
    try {
        let item = await Item.findOne({
            where: {id: req.params.id },
            raw: true,
            include: [
                {
                    model: User,
                    required: true,
                }
            ]});
        if(!item){
            return res.status(404).end();
        }
        item.user = {
            id: item['user.id'],
            name: item['user.name'],
            email: item['user.email'],
            phone: item['user.phone']
        };
        delete item['user.id'];
        delete item['user.name'];
        delete item['user.email'];
        delete item['user.phone'];
        delete item['user.password'];
        res.status(200).send(item)
    }
    catch (e) {
        res.status(500).send(e)
    }
};
const updateItem = async (req, res) => {
    if(req.body.title.length === 0 && req.body.price.length === 0){
        return res.status(422).send({
            field:'title',
            message:'Fields is required'
        });
    }
    try{
        const {password, ...userWithoutPassword} = req.user;
        const {dataValues: itemCheck} = await Item.findByPk(req.params.id);
        if(!itemCheck){
            return res.status(404).end()
        }
        if(itemCheck.user_id !== req.user.id){
            return res.status(403).end()
        }

        if(req.body.title.length === 0){
            await Item.update({price: req.body.price},
                {where: {id: req.params.id,user_id: req.user.id}});
            let {dataValues: item} = await Item.findByPk(req.params.id);
            return res.status(200).send({...item, user: userWithoutPassword})
        }
        else if(req.body.price.length === 0) {
            await Item.update({title: req.body.title},
                {where: {id: req.params.id, user_id: req.user.id}});
            let {dataValues: item} = await Item.findByPk(req.params.id);
            return res.status(200).send({...item, user: userWithoutPassword})
        }
        else {
            await Item.update({title: req.body.title, price: req.body.price},
                {where: {id: req.params.id, user_id: req.user.id}});
            let {dataValues: item} = await Item.findByPk(req.params.id);
            return res.status(200).send({...item, user: userWithoutPassword})
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
};
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findOne({
            where: {id: req.params.id},
            raw: true,
        });
        if(!item){
            return res.status(404).end()
        }
        if(item.user_id !== req.user.id){
            return res.status(403).end()
        }
        await Item.destroy({where: {id: item.id}});
        res.status(200).end()
    }
    catch (e) {
        res.status(500).send(e);
    }
};
const uploadImage = async (req, res) => {
    let fileData = req.file;
    if(!fileData && req.body.error)
        return res.status(422).send(req.body.error.message);
    const {password, ...userWithoutPassword} = req.user;
    const {dataValues: itemCheck} = await Item.findByPk(req.params.id);
    if(!itemCheck){
        return res.status(404).end()
    }
    if(itemCheck.user_id !== req.user.id){
        return res.status(403).end()
    }

    await Item.update({image: `http://localhost:4000/images/${req.file.filename}`},
        {where: {id: req.params.id, user_id: req.user.id}});
    let {dataValues: item} = await Item.findByPk(req.params.id);
    return res.status(200).send({...item, user: userWithoutPassword});
};

module.exports = {
    getAllItems,
    createItem,
    getItemById,
    updateItem,
    deleteItem,
    uploadImage };