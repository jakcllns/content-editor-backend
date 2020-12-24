module.exports = (req) => {
    if(!req.isAuth){
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
    }
    return true;
}