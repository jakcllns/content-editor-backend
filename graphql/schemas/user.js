const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        lastLogin: String
        twoFactor: Boolean!
    }

    type LoginData {
        userId: ID!
        token: String!
        expiresIn: Int!
    }

    input UserSignUpData {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        twoFactor: Boolean!
    }

    input UserLoginData {
        email: String!
        password: String!
    }

    type RootMutation {
        signup(userSignUpData: UserSignUpData): User!
    }

    type RootQuery {
        login(userLoginData: UserLoginData): LoginData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);