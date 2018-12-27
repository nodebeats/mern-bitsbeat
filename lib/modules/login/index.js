var bcrypttHelper = require('../../helpers/bcrypt.helper')
var mongoCLient = require('mongodb').MongoClient;
const tokenGenerator = require('../../helpers/jwt.helper');
const redisHelper = require('../../helpers/redis.helper');
const MAX_LOGIN_ATTEMPTS = 5; 
const ObjectID = require('mongodb').ObjectID;


mongoCLient.Promise = Promise;

//loginAttempts
let loginAttempts = 0;
if (loginAttempts) {
    loginAttempts = 0;

} else {
    loginAttempts;
}

exports.login_user = async (req, res, next) => {

    let collection = global.db.collection("User");

    //Suspend Time
    let setSuspendTime = new Date();


    let email = req.body.email;
    let password = req.body.password;


    // loginAttempts:0,lockUntil:Number

    //LoginAttempts logic
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {

        setSuspendTime.setMinutes(setSuspendTime.getMinutes() + 5);  //Block for 5 minutes

        //suspend the account
        collection.updateOne({ setBit: false }, { $set: { setBit: true } }, (err, data) => {
            if (err) return next(err);


            if (data) {
                res.json({
                    message: "Sorry, Your account is suspended"
                })
            }

        });

    }

    try {
        //Checking logic
        let emailChk = await collection.findOne({ email: email });


        //checking if email exists in database
        if (!emailChk) {
            return res.status(404).json({
                code: 404,
                status: 'NOT FOUND',
                message: "Email or password doesn't exist in the database please signup"
            });
        }


        // console.log("Passowrd hash value" + emailChk.password);

        //Comparing password 
        let result = await bcrypttHelper.comparePwd(password, emailChk.password);
        if (result == true) {

            //Generate JSON token along with Secret key(privatekey)
            const token = tokenGenerator.generateToken(emailChk._id.toString());
            console.log("Token =" + typeof token + token);

            //Save token to DB
            collection.updateOne({_id:ObjectID(emailChk._id)} ,{$set:{ jwtToken: token.toString()}});
                        
            console.log(req.originalUrl);
            
            // res.send("Posted");

            // //Storing it in the redis server
            // //token-> key value->userObj
            let userObj = {
                first_name: emailChk.first_name,
                last_name: emailChk.last_name,
                email: emailChk.email,
                salutation: emailChk.salutation
            }

            //setting in Redis Server
            redisHelper.saveToRedis(token, userObj);

            //Checking
            let value = await redisHelper.fetchData(token);
            // console.log('v = ',value);

            res.status(200).json({
                token: token,
                userId: emailChk._id,
                code: 200,
                status: 'OK',
                message: 'Token generated',
                data: JSON.parse(value)
            })
        }
        else {

            loginAttempts++;//increment By 1 

            console.log(parseInt(loginAttempts));

            return res.status(404).json({
                code: 400,
                status: 'NOT FOUND',
                message: "Incorrect Password"
            });

        }
    } catch (error) {
        next(error);
    }
}



