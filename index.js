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
const {PORT, DB_URI, DEV} = process.env;

//Register Middleware
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: require('./graphql/schema'),
    rootValue: require('./graphql/resolver'),
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
}))

//Connect to MongoDb and start listening on server
mongoose.connect(
    DB_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => {
        console.log(`Listening on http://localhost:${PORT}`);
        app.listen(PORT);
        
    })
    .catch(err => console.log(err));



