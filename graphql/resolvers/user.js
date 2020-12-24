//Packages
const validator = require('validator').default;
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {  } = require('mongoose');

//Models
const User = require('../../models/user');
const Post = require('../../models/post');

//Helper Functions
const isAuth = require('../../utils/is_auth');

module.exports = {
    //Create
    signup: async ({ userSignUpData }, req) => {
        const errors = [];
        if(!validator.isLength(userSignUpData.name.trim(), { min: 4 })){
            errors.push({message: 'Invalid name!'});
        }
        if(!validator.isEmail(userSignUpData.email.trim())){
            errors.push({message: 'Invalid E-Mail address!'});
        }
        if(!
            validator.matches(
                userSignUpData.password, 
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        ){
            errors.push({message: 'Invalid password!'});
        }

        if(errors.length > 0){
            const error = new Error('Invalid input!');
            error.data = errors;
            error.code = 400;
            throw error;
        }

        if(await User.findOne({email: userSignUpData.email.trim()})){
            const error = new Error(
                'Email already exists try logging in or using forgot password!'
                );
            error.code = 422;
            throw error;
        }

        const hash = await bcrypt.hash(userSignUpData.password, Number(process.env.SALT));
        
        const user = await new User({
            name: userSignUpData.name,
            email: userSignUpData.email.trim(),
            password: hash,
            twoFactor: userSignUpData.twoFactor
        }).save()

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin,
            posts: [],
            twoFactor: user.twoFactor
        }

    },
    publishContent: async ({ postInput }, req) => {
        isAuth(req);

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

        const user = await User.findById(req.userId);

        if(!user){
            const error = new Error('Invalid user!');
            error.code = 401;
            throw error;
        }

        const sanitizedContent = postInput.content.map(c => sanitizeHtml(c));

        const post = new Post({
            title: postInput.title,
            content: sanitizedContent,
            author: user,
            imageUrls: postInput.imageUrls
        });

        const createdPost = await post.save();
        
        user.posts.push(createdPost);
        user.totalPosts++;
        await user.save();

        return {
            ...createdPost._doc,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString()
        };
    },
    //Read
    login: async ({ userLoginData }, req) => {
        const errors = [];
        if(!validator.isEmail(userSignUpData.email.trim())){
            errors.push({message: 'Invalid E-Mail address!'});
        }
        if(!
            validator.matches(
                userSignUpData.password, 
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
        ){
            errors.push({message: 'Invalid password!'});
        }

        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findOne({email: userLoginData.email}).populate('posts');
        const ERROR_MESSAGE = 'Invalid E-Mail address or Password!';
        if(!user){
            const error = new Error(ERROR_MESSAGE);
            error.code = 401;
            throw error;
        }

        if(!await bcrypt.compare(userLoginData.password, user.password)){
            const error = new Error(ERROR_MESSAGE);
            error.code = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            {exipresIn: '1h'}
        );

        return {
            _id: user._id.toString(),
            token: token
        }
    },
    getUserPosts: async ({ page, perPage }, req) => {
        isAuth(req);

        const user = await User.findById(req.userId).populate({
            path: 'posts',
            options: {
                limit: perPage,
                sort: { createdAt: 'desc' },
                skip: (page-1) * perPage
            }
        });

        if(!user){
            const error = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        const posts = {
            posts: user.posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString()
                };
            }),
            totalPosts: user.totalPosts
        }

        return posts;
    },
    //Update
    editPost: async ({ postId, editInput }, req) => {
        isAuth(req);

        const user = await user.findById(req.userId).populate({
            path: 'posts',
            _id: postId
        });

        if(!user) {
            const error = new Error('Invalid user!');
            error.code = 404;
            throw error;
        }

        if(user.posts.length === 0){
            const error = new Error('Post not found!');
            error.code = 404;
            throw error;
        }

        const post = user.posts[0];

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

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString()
        }
    },
    //Delete
    deletePost: async ({ postId }, req) => {
        isAuth(req);

        const user = await User.findById(req.userId).populate({
            path: 'posts',
            _id: postId
        });

        if(!user){
            const error = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        if(user.posts.length === 0){
            const error = new Error('Post not found!');
            error.code = 404;
            throw error
        }

        const post = user.posts[0];

        let result = await post.delete()
        //check what delete returns as result when it is successful and when it fails
        console.log(result);

        try {
            result = await post.delete()
            console.log(result);
        } catch (err) {
            console.log(err);
        }
        
        return true;
    }
}