const Joi = require('joi');

const CreateUserSchema = Joi.object({
    name: Joi
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
    email: Joi
        .string()
        .email()
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
    phone: Joi
        .string()
        .allow('')
        .pattern(new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$'))
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
    password: Joi
        .string()
        .required()
        .pattern(/^[a-zA-Z0-9]{8,20}$/)
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

const LoginSchema = Joi.object({
    email: Joi
        .string()
        .email()
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = "\"login\" must consists of letters and numeric symbols, min 2 symbols and max 30 symbols"
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),

    password: Joi
        .string()
        .required()
        .pattern(/^[a-zA-Z0-9]{8,20}$/)
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case "string.pattern.base":
                        err.message = `
                            "password" must has min 8 symbols, max 16 symbols, only digital letters and literal letters`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
})

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


const validatorCreateUserMiddleware = async (req, res, next) => {
    try {
        await validation(CreateUserSchema, req.body);
        next()
    } catch (e) {
        res.status(422).send(e.message)
    }
};

const validatorLoginUserMiddleware = async (req, res, next) => {
    try {
        await validation(LoginSchema, req.body);
        next()
    } catch (e) {
        res.status(400).send(e.message)
    }
};

module.exports = {validatorCreateUserMiddleware,
    validatorLoginUserMiddleware};