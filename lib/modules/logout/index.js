const jwtHelper = require('../../helpers/jwt.helper');
const redisHepler = require('../../helpers/redis.helper');
const testVerify = require('../../helpers/jwt.helper');

exports.logout_user = async (req, res, next) => {
    const ObjectID = require('mongodb').ObjectID;


    console.log('req.decodedUser', req.decodedUser.userId);
    
    
    let collection = global.db.collection("User");
    try {
        let deleteJWT = await collection.update({_id:ObjectID(req.decodedUser.userId)},{ $unset:{ jwtToken:""}});
        res.json({
            code: 200,
            status: 'OK',
            message: "Successfully logout"
        })


    } catch (error) {
        next(error);
    }








}