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

    type PostsData {
        posts: [Post]!
        totalPosts: Int!
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

    input PageInput {
        page: Int!
        perPage: Int!
    }

    type RootMutation {
        publishContent(postInput: PostInput): Post!
        deletePost(postId: ID!): Boolean!
        editPost(postId: ID!, editInput: EditInput): Post!
    }

    type RootQuery {
        getPublishedContent(pageInput: PageInput): PostsData!
        getSinglePost(postId: ID!): Post!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)