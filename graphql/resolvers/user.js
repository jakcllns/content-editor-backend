//Packages
const validator = require('validator').default;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

//Models
const User = require('../../mongoose/dbs/users').models.user;
const Profile = require('../../mongoose/dbs/posts').models.profile;
const Token = require('../../mongoose/dbs/users').models.token

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
    login: async ({ userLoginData }, { res }) => {
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
            {expiresIn: 900}//15 minutes
        );

        const refreshToken = jwt.sign(
            {id: user._id},
            process.env.REFRESH_SECRET_KEY,
            {expiresIn: '1h'}
        )

        const expiration = new Date;
        expiration.setMinutes(expiration.getMinutes() + 60);

        const tokenModel = new Token({
            token: refreshToken,
            expiration: expiration,
            user: user
        });

        await tokenModel.save();
        
        res.cookie(
            'refresh_token',
            refreshToken,
            {
                httpOnly: true,
                sameSite: 'lax',
                secure: false,
                maxAge: 60*60*1000
                
            }
        );
        
        user.lastLogin = Date();
        await user.save();

        return {
            userId: user._id.toString(),
            token: token,
            expiresIn: 15*60*1000
        }
    },
    //Update

    //Delete
}