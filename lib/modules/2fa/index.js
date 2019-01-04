
const redisHelper = require('../../helpers/redis.helper');
const speakeasy = require('speakeasy'),
    qrcode = require('qrcode');


exports.setup2FAinApp = async (req, res, next) => {


    //Generating secret key
    let secretVal = speakeasy.generateSecret({ length: 10, encoding: 'base32' });
    console.log('Secret key =', secretVal);

    
    //Storing the secret key in Express Session
    let sessionObject;
    sessionObject = req.session;

    //SET in the  Session Store
    sessionObject.secretKey = secretVal;
   
    console.log('Secret Key => ', sessionObject.secretKey);
   
  
    //Qrcode
    try {
        let qrdata = await qrcode.toDataURL(sessionObject.secretKey.otpauth_url);
        
        res.json({
            qrcodeImage:qrdata
        })

    } catch (error) {
        console.log(error);

    }

}

exports.verifySecretKey = async (req, res, next) => {

    console.log("Secret key from session object => ",req.session.secretKey.base32);

    // console.log('secretVal, Value', secretVal, typeof secretVal, JSON.parse(secretVal).base32);
    
    //Verify Token
    let verified = speakeasy.totp.verify({
        secret: req.session.secretKey.base32,
        encoding: 'base32',
        token: req.body.token

    });

    console.log(verified);
    // res.json({
    //     message: verified
    // })

}

exports.deleteSecretKey = (req,res,next) => {
    delete req.session;
    res.json({message:'Session successfully Destroyed'})

}
