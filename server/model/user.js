const Sequelize = require('sequelize');
const dbConnection = require('../database/index');


const User = dbConnection.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;