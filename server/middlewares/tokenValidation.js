const jwt = require('jsonwebtoken');
const User = require('../model/user');
const {verifyToken} = require('../sevices/token.service');

const tokenValidation = async (req, res, next) => {
    if (!req.headers.authorization){
        return res.status(401).end();
    }
    if (typeof req.headers.authorization !== 'string'){
        return res.status(401).end();
    }
    let token = req.headers.authorization;
    try {
        let data = await verifyToken(token);
        if (data && data.id){
            const user = await User.findOne({
                where:{
                    id: data.id
                },
                raw: true
            });
            if(user) {
                req.user = user;
                next();
            }
            else return res.status(401).end();
        } else {
            res.status(401).end();
        }
    }
    catch(e){
        res.status(401).send(e);
    }
};

module.exports = tokenValidation;