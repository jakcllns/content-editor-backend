//Packages
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization');

    if(!token){
        console.log('Auth header not found');
        req.isAuth = false;
        return next();
    }

    // const token = req.get('Authorization').split(' ')[1];
    console.log(token);
    
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decodedToken){
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodedToken.userId;
        console.log('Token decoded')
    } catch (error) {
        // console.log(error);
        req.isAuth = false;
        return next();
    }
    
    return next();
};