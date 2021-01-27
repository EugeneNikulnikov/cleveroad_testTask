const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbConnection = require('./database/index');
const apiRouter = require('./router/user');
const Item = require('./model/item');
const User = require('./model/user');

const app = express();
const jsonParser = express.json();

app.use(cors());
app.use(jsonParser);
app.use(express.static(__dirname));


User.hasMany(Item, {onDelete: "cascade", foreignKey:'user_id'});
Item.belongsTo(User, {foreignKey:'user_id'});

dbConnection.sync({ alter: true })
    .catch(err => console.log(err));

app
    .use('/api', apiRouter)
    .listen(process.env.PORT);



