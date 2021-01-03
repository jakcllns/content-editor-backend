//Packages
const validator = require('validator').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Models
const User = require('../../mongoose/dbs/users').models.user;
const Profile = require('../../mongoose/dbs/posts').models.profile;
//Helper Functions


module.exports = {
    //Create
    signup: async ({ userSignUpData }, req) => {
        const errors = [];
        if(
            !validator.isLength(userSignUpData.firstName.trim(), { min: 4 }) &&
            !validator.isLength(userSignUpData.lastName.trim(), { min: 4 })
        ){
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
            email: userSignUpData.email.trim(),
            password: hash,
            twoFactor: userSignUpData.twoFactor
        }).save()

        const profile = await new Profile({
            _id: user._id,
            firstName: userSignUpData.firstName,
            lastName: userSignUpData.lastName,
        }).save();

        return {
            _id: user._id.toString(),
            email: user.email,
            lastLogin: user.lastLogin,
            twoFactor: user.twoFactor
        }

    },
    //Read
    login: async ({ userLoginData }, req) => {
        const errors = [];
        if(!validator.isEmail(userLoginData.email.trim())){
            errors.push({message: 'Invalid E-Mail address!'});
        }
        if(!
            validator.matches(
                userLoginData.password, 
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

        const user = await User.findOne({email: userLoginData.email});
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
            {expiresIn: '1h'}
        );

        user.lastLogin = Date();
        await user.save();

        return {
            _id: user._id.toString(),
            token: token
        }
    },
    //Update

    //Delete
}