const mongoose = require('mongoose');
const { DB_URI, POST_DB } = process.env;
const postSchema = require('../schemas/post');
const profileSchema = require('../schemas/profile');

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const postDb = {
    connection: mongoose.createConnection(),
    uri: DB_URI + POST_DB,
    options: options
};

postDb.model = postDb.connection.model('Post', postSchema);
postDb.model = postDb.connection.model('Profile', profileSchema);

module.exports = postDb;