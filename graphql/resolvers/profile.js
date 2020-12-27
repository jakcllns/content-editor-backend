//Packages
const validator = require('validator').default;
const sanitizeHtml = require('sanitize-html');

//Models
const User = require('../../mongoose/dbs/users').models.user;
const Post = require('../../mongoose/dbs/posts').models.post;
const Profile = require('../../mongoose/dbs/posts').models.profile;

//Helper Functions
const isAuth = require('../../utils/is_auth');

module.exports = {
    //Create
    publishContent: async ({ postInput }, req) => {
        isAuth(req);
    
        const errors = [];
        if(validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {min: 5})){
            errors.push({message: 'Title is invalid'});
        }

        if(postInput.content.some(c => validator.isEmpty(c))){
            errors.push({message: 'Content is invalid'})
        }
        
        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const profile = await Profile.findById(req.userId);

        if(!profile){
            const error = new Error('Invalid user!');
            error.code = 401;
            throw error;
        }

        const sanitizedContent = postInput.content.map(c => sanitizeHtml(c));

        const post = new Post({
            title: postInput.title,
            content: sanitizedContent,
            author: profile,
            imageUrls: postInput.imageUrls
        });

        const createdPost = await post.save();
        
        profile.posts.push(createdPost);
        profile.totalPosts++;
        await profile.save();

        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString()
        };
    },
    //Read
    getUserPosts: async ({ page, perPage }, req) => {
        isAuth(req);

        const profile = await Profile.findById(req.userId).populate({
            path: 'posts',
            options: {
                limit: perPage,
                sort: { createdAt: 'desc' },
                skip: (page-1) * perPage
            }
        });

        if(!profile){
            const error = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        const posts = {
            posts: profile.posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    author: {
                        ...profile, 
                        _id: profile._id,
                    }
                };
            }),
            totalPosts: profile.totalPosts
        }

        console.log(posts.posts);
        return posts;
    },
    getUserPost: async ({ postId }, req) => {
        isAuth(req);
        
        const profile = await Profile.findById(req.userId).populate({
            path: 'posts',
            _id: postId
        });

        if(!profile){
            const error = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        if(profile.posts.length === 0) {
            const error = new Error('Post not found!');
            error.code = 404;
            throw error;
        }

        const post = profile.posts[0];

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            author: {
                ...profile._doc,
                createdAt: profile.createdAt.toISOString(),
                _id: profile._id.toString()
            }
        };

    },
    //Update
    editPost: async ({ postId, editInput }, req) => {
        isAuth(req);

        const profile = await Profile.findById(req.userId).populate({
            path: 'posts',
            _id: postId
        });

        if(!profile) {
            const error = new Error('Invalid user!');
            error.code = 404;
            throw error;
        }

        if(profile.posts.length === 0){
            const error = new Error('Post not found!');
            error.code = 404;
            throw error;
        }

        const post = profile.posts[0];

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

        post.title = editInput.title;
        post.content = sanitizedContent;
        post.imageUrls = editInput.imageUrls || []
        
        await post.save()

        const result = {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            author: {
                ...profile._doc,
                _id: profile._id.toString(),
                createdAt: profile.createdAt.toISOString()
            }
        }

        return result;
    },
    
    //Delete
    deletePost: async ({ postId }, req) => {
        isAuth(req);

        const profile = await Profile.findById(req.userId).populate({
            path: 'posts',
            _id: postId
        });

        if(!profile){
            const error = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        if(profile.posts.length === 0){
            const error = new Error('Post not found!');
            error.code = 404;
            throw error
        }

        const post = profile.posts[0];
        let result = await post.delete()

        profile.posts = profile.posts.filter(p => p._id.toString() !== postId);
        profile.totalPosts--
        await profile.save();
        
        return true;
    }
}