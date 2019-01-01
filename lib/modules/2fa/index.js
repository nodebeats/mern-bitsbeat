
const redisHelper = require('../../helpers/redis.helper');
const speakeasy = require('speakeasy'),
    qrcode = require('qrcode');


exports.setup2FAinApp = async (req, res, next) => {


    //Generating secret key
    let secretVal = speakeasy.generateSecret({ length: 10, encoding: 'base32' });
    console.log('Secret key =', secretVal);

    //key-> userID value -> secretVal
    console.log('req.decodedUser', req.decodedUser.userId);

    //Saving the secret key in Rpolicy_listedis server
    redisHelper.saveToRedis(req.decodedUser.userId, secretVal);

    //GET
    let value = await redisHelper.fetchData(req.decodedUser.userId);
    console.log('Value', value);

    //Qrcode
    try {
        let qrdata = await qrcode.toDataURL(secretVal.otpauth_url);
        
        res.json({
            qrcodeImage:qrdata
        })
        // console.log(qrdata);

    } catch (error) {
        console.log(error);

    }

}

exports.verifySecretKey = async (req, res, next) => {


    let secretVal = await redisHelper.fetchData(req.decodedUser.userId);
    console.log('secretVal, Value', secretVal, typeof secretVal, JSON.parse(secretVal).base32);

    
    //Verify Token
    let verified = speakeasy.totp.verify({
        secret: JSON.parse(secretVal).base32,
        encoding: 'base32',
        token: req.body.token

    });

    console.log(verified);
    res.json({
        message: verified
    })

}

