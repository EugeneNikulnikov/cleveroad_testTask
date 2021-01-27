const bcrypt = require('bcrypt');
const User = require('../model/user');
const {createToken} = require('../sevices/token.service');

const getAllUsers = async (req, res) => {
    let users = await User.findAll({raw:true});
    await User.destroy({where: {email: 'Bentley'}});
    res.send(`<pre>${JSON.stringify(users, null, 4)}</pre>`)
};
const getUser = async (req, res) =>{
    try{
        const {password, ...userRes} = req.user;
        res.status(200).send(userRes)
    }
    catch (e) {
        res.status(500).send(e)
    }
};
const register = async (req, res) => {
    if(req.body.name.length === 0 || req.body.email.length === 0
        || req.body.password.length === 0){
        return res.status(422).end();
    }
    try{
        let userCheck = await User.findOne({
            where: {
                email: req.body.email
            },
            raw: true,
        });
        if(userCheck !== null) {
            return res.status(422).send({
                field: 'email',
                message: 'This email is already exists'
            });
        }

        const salt = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);
        const hash = bcrypt.hashSync(req.body.password, salt);

        let {dataValues: user} = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash
        });
        const token = await createToken(user.id);
        res.status(200).send({token})
    }
    catch (e) {
        res.status(500).send(e)
    }
};
const login = async (req, res) => {
    if( req.body.email === undefined){
        return res.status(422).end(JSON.stringify({
            field: 'email',
            message: 'Wrong email or password'
        }));
    }
    if( req.body.password === undefined){
        return res.status(422).end(JSON.stringify({
            field: 'password',
            message: 'Wrong email or password'
        }));
    }
    try{
        let userFind = await User.findOne({
            where: {
                email: req.body.email
            },
            raw:true
        });
        if(userFind === null) {
            return res.status(422).end(JSON.stringify({
                field: 'password',
                message: 'Wrong email or password'
            }));
        }
        const match = await bcrypt.compare(req.body.password, userFind.password);
        if(!match){
            return res.status(422).end(JSON.stringify({
                field: 'password',
                message: 'Wrong email or password'
            }));
        }
        const token = await createToken(userFind.id);
        res.status(200).send({token})
    }
    catch (e) {
        res.status(500).end()
    }
};

module.exports = {
    getAllUsers,
    getUser,
    register,
    login};
