const mongoose = require('mongoose');
const { DB_URI, POST_DB } = process.env;
const postSchema = require('../schemas/post');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const postDb = {
    connection: mongoose.createConnection(),
    uri: DB_URI, POST_DB,
    options: options
};

postDb.model = postDb.connection.model('User', postSchema);

module.exports = postDb;