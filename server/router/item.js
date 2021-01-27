const express = require('express');
const tokenValidation = require('../middlewares/tokenValidation');
const upload = require('../middlewares/uploadImage');
const {getAllItems,
    createItem,
    getItemById,
    updateItem,
    deleteItem,
    uploadImage
} = require('../controllers/item');
const {validatorCreateItemMiddleware,
    validatorUpdateItemMiddleware} = require('../validation/item');

const apiItemRouter = express.Router();

apiItemRouter
    .get('/', getAllItems)
    .post('/', tokenValidation, validatorCreateItemMiddleware, createItem)
    .get('/:id', getItemById)
    .post('/:id', tokenValidation, validatorUpdateItemMiddleware, updateItem)
    .delete('/:id', tokenValidation, deleteItem)
    .post('/:id/images', tokenValidation, upload, uploadImage);

module.exports = apiItemRouter;