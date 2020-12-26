const mongoose = require('mongoose');
const { DB_URI, USER_DB } = process.env;
const userSchema = require('../schemas/user');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const userDb = {
    connection: mongoose.createConnection(),
    uri: DB_URI + USER_DB,
    options: options
};

userDb.model = userDb.connection.model('User', userSchema);

module.exports = userDb;