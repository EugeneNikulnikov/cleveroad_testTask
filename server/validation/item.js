const Joi = require('joi');


const CreateItemSchema = Joi.object({
    title: Joi
        .string()
        .pattern(new RegExp('^[a-zA-ZА-Яа-я]{2,}$'))
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = "\"Comment\" must min 1 symbols and max 60 symbols";
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    price: Joi
        .number()
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = "\"postId\" is not valid ObjectId"
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});


const UpdateItemSchema = Joi.object({
    title: Joi
        .string()
        .allow('')
        .pattern(new RegExp('^[a-zA-ZА-Яа-я]{2,}$'))
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = "\"Comment\" must min 1 symbols and max 60 symbols";
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    price: Joi
        .number()
        .allow('')
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = "\"postId\" is not valid ObjectId";
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});


const validation = async (Schema, data) =>  {
    const {error} = await Schema.validate(data);
    if (error) {
        const message = error.details.reduce((msg, item) => {
            if (msg) return `${msg}, ${item.message}`;
            return item.message
        }, '');
        throw new Error(message);
    }
};

const validatorCreateItemMiddleware = async (req, res, next) => {
    try {
        await validation(CreateItemSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
    }
};

const validatorUpdateItemMiddleware = async (req, res, next) => {
    try {
        await validation(UpdateItemSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
    }
};

module.exports = {
    validatorCreateItemMiddleware,
    validatorUpdateItemMiddleware
};