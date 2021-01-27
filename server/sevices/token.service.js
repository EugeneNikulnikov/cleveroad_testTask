const jwt = require('jsonwebtoken');

const createToken = async id => {
    const token = await jwt.sign({id}, process.env.ACCESS_JWT_KEY);
    return 'Bearer ' + token;
};

const verifyToken = async token => {
    return await jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_JWT_KEY);
};

module.exports = {
    createToken,
    verifyToken,
};