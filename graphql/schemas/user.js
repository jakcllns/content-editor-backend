const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        lastLogin: String!
        posts: [Post]
        two_factor: Boolean!
    }

    input UserSignUpData {
        name: String!
        email: String!
        password: String!
        two_factor: Boolean!
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