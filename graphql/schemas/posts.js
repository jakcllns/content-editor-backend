const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        imageUrls: [String]
        content: [String!]!
        author: User!
        createdAt: String!
    }

    type User {
        _id: ID!
        firstName: String!
        lastName: String!
    }

    type PostsData {
        posts: [Post]!
        totalPosts: Int!
    }

    input PageInput {
        page: Int!
        perPage: Int!
    }

    type RootQuery {
        getPublishedContent(pageInput: PageInput): PostsData!
        getSinglePost(postId: ID!): Post!
    }

    schema {
        query: RootQuery
    }
`)