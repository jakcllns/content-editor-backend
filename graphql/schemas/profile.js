const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Profile {
        _id: ID!
        name: String!
        posts: [Post]
        totalPosts: Int!
        createdAt: String!
    }

    type Post {
        _id: ID!
        title: String!
        imageUrls: [String]
        content: [String!]!
        author: Profile!
        createdAt: String!
    }

    type PostsData {
        posts: [Post]!
        totalPosts: Int!
    }

    input PostInput {
        title: String!
        content: [String!]!
        imageUrl: [String]

    }

    input EditInput {
        title: String!
        content: [String!]!
        imageUrl: [String]
    }

    type RootMutation {
        publishContent(postInput: PostInput): Post!
        deletePost(postId: ID!): Boolean!
        editPost(postId: ID!, editInput: EditInput): Post!
    }

    type RootQuery {
        getUserPosts(page: Int!, perPage: Int!): PostsData!
        getUserPost(postId: ID!): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);