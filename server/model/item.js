const Sequelize = require('sequelize');
const dbConnection = require('../database/index');

const Item = dbConnection.define("item", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        defaultValue: null
    }
});

module.exports = Item;