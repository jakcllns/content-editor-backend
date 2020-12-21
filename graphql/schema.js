const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Content {
        _id: ID!
        title: String!
        imageUrls: [String]
        content: [String!]!
        author: String!
        createdAt: String!
    }

    input ContentInput {
        title: String!
        content: [String!]
        imageUrl: [String]
        author: String!

    }

    type RootMutation {
        publishContent(contentInput: ContentInput): Content!
    }

    type RootQuery {
        getPublishedContent: Content!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)