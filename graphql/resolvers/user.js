//Packages
const validator = require('validator').default;
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Models
const User = require('../../models/user');
const Post = require('../../models/post');

module.exports = {
    //Create
    signup: async ({ userSignUpData }, req) => {
        const errors = [];
        if(!validator.isLength(userSignUpData.name.trim(), { min: 4 })){
            errors.push({message: 'Invalid name!'});
        }
        if(validator.isEmail(userSignUpData.email.trim())){
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

        if(await User.findOne({email: userSignUpData.trim()})){
            const error = new Error(
                'Email already exists try logging in or using forgot password!'
                );
            error.code = 422;
            throw error;
        }

        const hash = await bcrypt.hash(userSignUpData.password, process.env.SALT);
        
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
        //will update once isAuth middleware is added in to handle JWT
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