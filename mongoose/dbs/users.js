const mongoose = require('mongoose');
const { DB_URI, USER_DB } = process.env;
const userSchema = require('../schemas/user');
const tokenSchema = require('../schemas/refresh-token');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const userDb = {
    connection: mongoose.createConnection(),
    uri: DB_URI + USER_DB,
    options: options
};

userDb.models = {
    user: userDb.connection.model('User', userSchema),
    token: userDb.connection.model('Token', tokenSchema)
};

module.exports = userDb;