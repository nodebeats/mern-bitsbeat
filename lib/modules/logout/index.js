const jwtHelper = require('../../helpers/jwt.helper');
const redisHepler = require('../../helpers/redis.helper');
const testVerify = require('../../helpers/jwt.helper');

exports.logout_user = (req, res,next) => {


    //Fetch from redis server
    redisHepler.fetchData(req.headers['x-auth-token']);


    res.json({
        code: 200,
        status: 'OK',
        message: "Success"
    })






}