//Packages
const app = require('express')();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');

//Setup Environment variables
require('dotenv').config({
    path: path.join(process.mainModule.path, '.env')
});

//Environment varialbes
const {PORT, DB_URI, USER_DB, POST_DB, DEV} = process.env;

//Register Middleware
const auth = require('./middleware/auth');

app.use(bodyParser.json());

app.use(auth);

app.use('/user', graphqlHTTP({
    schema: require('./graphql/schemas/user'),
    rootValue: require('./graphql/resolvers/user'),
    graphiql: JSON.parse(DEV),
    customFormatErrorFn(err) {
        if(!err.originalError) {
            return err;
        }

        return {
            message: err.message || 'An error occurred',
            status: err.originalError.code,
            data: err.originalError.data
        };
    }
}));

app.use('/posts', graphqlHTTP({
    schema: require('./graphql/schemas/posts'),
    rootValue: require('./graphql/resolvers/posts'),
    graphiql: JSON.parse(DEV),
    customFormatErrorFn(err) {
        if(!err.originalError) {
            return err;
        }

        return {
            message: err.message || 'An error occurred',
            status: err.originalError.code,
            data: err.originalError.data
        };
    }
}));

//Error handling
app.use((error, req, res, next)=>{
    console.log(error);
    res.status(error.statusCode || 500).json({message: error.message});
});

//Connect to MongoDb and start listening on server
const userDb = require('./mongoose/dbs/users');
const postDb = require('./mongoose/dbs/posts');

userDb.connection.openUri(userDb.uri, userDb.options)
    .then(connection => {
        console.log(`Connection to the ${connection.db.databaseName} database established!`);
    })
    .then(() => {
        return postDb.connection.openUri(postDb.uri, postDb.options);
    })
    .then(connection => {
        console.log(`Connection to the ${connection.db.databaseName} database established!`);
    })
    .catch(err => console.log(err))
    .finally(() => {
        console.log(`Listening on http://localhost:${PORT}`);
        app.listen(PORT);
    });