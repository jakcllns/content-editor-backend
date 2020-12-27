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

postDb.models = {
    post: postDb.connection.model('Post', postSchema),
    profile: postDb.connection.model('Profile', profileSchema)
};

module.exports = postDb;