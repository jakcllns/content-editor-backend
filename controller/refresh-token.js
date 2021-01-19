const Token = require('../mongoose/dbs/users').models.token;
const jwt = require('jsonwebtoken');

exports.postRefreshToken = async (req, res, next) => {
    try {
        const cookieArr = req.headers.cookie
            .split('; ')
            .map(c => c.split('='));
        const [refeshCookie] = cookieArr.length > 0 && cookieArr
            .filter(cookie => cookie[0] === 'refresh_token');
        
        const [_, token] = refeshCookie;

        if(!token){
            throw new Error('No Refresh Cookie');
        }
    
        const decodedToken = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
        const userId = decodedToken.id;
        const refreshToken = await Token.findOne({token: token, user: userId })
        .populate('User');

        if(!refreshToken){
            throw new Error('Refresh token not found');
        }
        const newJwt = jwt.sign(
            {
                userId: userId,
                email: refreshToken.user.email
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '15m'}
        );

        const exp = new Date((decodedToken.exp + 60 * 15) * 1000);

        if(exp <= Date.now()){
            const newRefreshToken = jwt.sign(
                {id: userId},
                process.env.REFRESH_SECRET_KEY,
                {expiresIn: '1h'}
            )
            await new Token({
                token: newRefreshToken,
                userId: userId
            }).save();
            
            
            res.cookie(
                'refresh_token',
                newRefreshToken,
                {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                    maxAge: 60*60*1000
                }
            );
        }

        return res.status(200).json({
            userId: userId,
            token: newJwt,
            expiresIn: 15*60*1000
        });
        
    } catch(err) {
        res.clearCookie('refresh_token');
        next(err);
    }  
};

exports.postSignOut = async (req, res, next) => {
    let refreshToken;
    let userId;
    try{
        const cookieArr = req.headers.cookie
            .split('; ')
            .map(c => c.split('='));
        const [refeshCookie] = cookieArr.length > 0 && cookieArr
            .filter(cookie => cookie[0] === 'refresh_token');
        
        const [_, token] = refeshCookie;
        
        if(!token){
            throw new Error('No Refresh Cookie');
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
        refreshToken = token;
        userId = decodedToken.id;
    } catch(err) {
        res.clearCookie('refresh_token');
        return next(err);
    }

    const myToken = await Token.findOne({token: refreshToken, user: userId})
    
    if(myToken){
        myToken.delete();
    }

    res.clearCookie('refresh_token');
    
    return res.status(200).json({
        result: true
    });
    
    
}