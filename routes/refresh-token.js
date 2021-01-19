//Packages
const router = require('express').Router();
const refreshTokenController = require('../controller/refresh-token');

//Post request

router.post(
    '/signout',
    refreshTokenController.postSignOut
);

router.post(
    '/',
    refreshTokenController.postRefreshToken
)

exports.routes = router;