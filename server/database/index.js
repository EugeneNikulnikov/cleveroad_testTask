const Sequelize = require('sequelize');

const dbConnection = new Sequelize(process.env.DB_NAME,
    process.env.USER_DB,
    process.env.PASSWORD_DB,
    {dialect: "mysql",
        host: "localhost",
        define: {
            timestamps: false
        }});

module.exports = dbConnection;