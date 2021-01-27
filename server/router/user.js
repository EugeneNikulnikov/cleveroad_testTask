const express = require('express');
const apiItemRouter = require('../router/item');
const tokenValidation = require('../middlewares/tokenValidation');
const {
    getAllUsers,
    getUser,
    register,
    login} = require('../controllers/user');

const {validatorCreateUserMiddleware,
    validatorLoginUserMiddleware} = require('../validation/user');

const apiRouter = express.Router();

apiRouter
    .get('/', getAllUsers)
    .get('/me', tokenValidation, getUser)
    .post('/register', validatorCreateUserMiddleware, register)
    .post('/login', validatorLoginUserMiddleware, login)
    .use('/items', apiItemRouter);

module.exports = apiRouter;