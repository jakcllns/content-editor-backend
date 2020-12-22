const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        lastLogin: String
        posts: [Post]
        twoFactor: Boolean!
    }

    input UserSignUpData {
        name: String!
        email: String!
        password: String!
        twoFactor: Boolean!
    }

    input UserLoginData {
        email: String!
        password: String!
    }

    type RootMutation {
        signup(userSignUpData: UserSignUpData) User!
    }

    type RootQuery {
        login(userLoginData: UserLoginData) User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);