
const redisHelper = require('../../helpers/redis.helper');
const speakeasy = require('speakeasy'),
    qrcode = require('qrcode'),
    util = require('../../commons/util');

    const ObjectID = require('mongodb').ObjectID;



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
            qrcodeImage: qrdata
        })

    } catch (error) {
        console.log(error);

    }

}

exports.verifySecretKey = async (req, res, next) => {


    if(!req.session.secretKey){
        return res.json(util.renderApiErr(req,res,'404',"Session is destroyed please enable 2FA"));

    }
    
    console.log("Secret key from session object => ", req.session.secretKey.base32);


    //Verify Token
    let verified = speakeasy.totp.verify({
        secret: req.session.secretKey.base32,
        encoding: 'base32',
        token: req.body.token

    });

    if (verified) {
        const collection = global.db.collection('User');

        console.log('req.decodedUser', req.decodedUser.userId);

        const data = await collection.findOne({ _id: ObjectID(req.decodedUser.userId) }, { projection: { _id: 1, first_name: 1, last_name: 1, email: 1, salutation: 1, user_role: 1 } });
        console.log(data);

        return res.json(util.renderApiData(req, res, 200, 'User data', { userData: data }));
    } else {
        return res.json(util.renderApiErr(req, res, '401', 'Unauthorized'));
    }

    // console.log(verified);
    // res.json({
    //     message: verified
    // })
}

exports.deleteSecretKey = (req, res, next) => {
    delete req.session.secretKey;
    res.json({ message: 'Session successfully Destroyed' })
}
