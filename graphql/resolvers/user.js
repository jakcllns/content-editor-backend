//Packages
const validator = require('validator').default;
const sanitizeHtml = require('sanitize-html');

//Models
const User = require('../../models/user');
const Post = require('../../models/post');

module.exports = {
    //Create
    signup: async ({ userSignUpData }, req) => {

    },
    publishContent: async ({ postInput }, req) => {
        const errors = [];
        if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})){
            errors.push({message: 'Title is invalid'});
        }
        if(validator.isEmpty(postInput.author.trim())){
            errors.push({message: 'No author provided'});
        }

        if(editInput.content.some(c => validator.isEmpty(c))){
            errors.push({message: 'Content is invalid'})
        }
        
        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const sanitizedContent = postInput.content.map(c => sanitizeHtml(c));

        const post = new Post({
            title: postInput.title,
            content: sanitizedContent,
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
    //Read
    login: async ({ userLoginData }, req) => {

    },
    getUserPost: async ({ page, perPage }, req) => {

    },
    //Update
    editPost: async ({ postId, editInput }, req) => {
        const errors = [];
        if(validator.isEmpty(editInput.title) || !validator.isLength(editInput.title, {min: 5})){
            errors.push({message: 'Title is invalid'});
        }

        if(editInput.content.some(c => validator.isEmpty(c))){
            errors.push({message: 'Content is invalid'})
        }

        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const sanitizedContent = editInput.content.map(c => sanitizeHtml(c));

        const post = await Post.findById(postId);

        if(!post) {
            const error = new Error('Post not found');
            error.code = 404;
            throw error;
        }

        post.title = editInput.title;
        post.content = sanitizedContent;
        post.imageUrls = editInput.imageUrls || []
        
        await post.save()

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString()
        }
    },
    //Delete
    deletePost: async ({ postId }, req) => {
        try {
            const result = await Post.findByIdAndDelete(postId)
            if (!result) {
                return false;
            }
        } catch (err){
            err.code = 404;
            throw err;
        }
        
        return true;
    }
}