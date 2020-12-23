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

    type Post {
        _id: ID!
        title: String!
        imageUrls: [String]
        content: [String!]!
        author: User!
        createdAt: String!
    }

    type PostsData {
        posts: [Post]!
        totalPosts: Int!
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

    input PostInput {
        title: String!
        content: [String!]!
        imageUrl: [String]
        author: String!

    }

    input EditInput {
        title: String!
        content: [String!]!
        imageUrl: [String]
    }

    type RootMutation {
        signup(userSignUpData: UserSignUpData) User!
        publishContent(postInput: PostInput): Post!
        deletePost(postId: ID!): Boolean!
        editPost(postId: ID!, editInput: EditInput): Post!
    }

    type RootQuery {
        login(userLoginData: UserLoginData) User!
        getUserPost(userId: ID!, page: Int!, perPage: Int!) PostsData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);