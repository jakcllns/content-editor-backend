const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        imageUrls: [String]
        content: [String!]!
        author: String!
        createdAt: String!
    }

    type ContentData {
        posts: [Content!]!
        totalPosts: Int!
    }

    input PostInput {
        title: String!
        content: [String!]!
        imageUrl: [String]
        author: String!

    }

    type RootMutation {
        publishContent(postInput: PostInput): Post!
    }

    type RootQuery {
        getPublishedContent: [Content!]!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)