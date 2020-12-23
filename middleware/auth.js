//Packages
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorizaiontion');

    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = req.get('Authorizaion').split(' ')[1];
    
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decodedToken){
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        req.userId = decodedToken.userId;
    } catch (error) {
        req.isAuth = false;
        return next();
    }
    
    return next();
};