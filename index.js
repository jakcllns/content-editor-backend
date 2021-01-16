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
const {PORT, DEV, ALLOWED_URLS} = process.env;

//Register Middleware
const auth = require('./middleware/auth');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_URLS);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization, Set-Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

const graphqlUser = (_, res) =>({
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
    },
    context: { res }
});

const graphqlProfile = {
    schema: require('./graphql/schemas/profile'),
    rootValue: require('./graphql/resolvers/profile'),
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
};

const graphqlPost = {
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
}

app.use(bodyParser.json());

app.use(auth);

app.use('/user', graphqlHTTP(graphqlUser));

app.use('/profile', graphqlHTTP(graphqlProfile));

app.use('/posts', graphqlHTTP(graphqlPost));

// app.use('/refresh-token', require('./routes/refresh-token').routes);

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