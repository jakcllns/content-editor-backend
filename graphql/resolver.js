//Packages
const validator = require('validator').default;
const sanitizeHtml = require('sanitize-html');

//Models
const Post = require('../models/post');

module.exports =  {
    publishContent: async ({postInput}, req) => {
        const errors = [];
        if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})){
            errors.push({message: 'Content is invalid'});
        }
        if(validator.isEmpty(postInput.author.trim())){
            errors.push({message: 'No author provided'});
        }

        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const sanitizedPost = postInput.content.map(p => sanitizeHtml(p));

        const post = new Post({
            title: postInput.title,
            content: sanitizedPost,
            author: postInput.author,
            imageUrls: postInput.imageUrls
        });

        const createdPost = await post.save();

        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString()
        };
    },
    getPublishedContent: async ({pageInput}, req) =>{
        const totalPost = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({createdAt: 'desc'})
            .skip((pageInput.page -1)*pageInput.perPage)
            .limit(pageInput.perPage);
        return { 
            posts: posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString()
                };
            }),
            totalPost: totalPost
        };
    }
};