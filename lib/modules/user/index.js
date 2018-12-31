const BCRYPT_SALT_ROUNDS = 10,
bcrypttHelper = require('../../helpers/bcrypt.helper'),
mongoCLient = require('mongodb').MongoClient,
ObjectID = require('mongodb').ObjectID,
configMessage = require("./config"),
paginate = require('./../../helpers/utilities.helper'),
errMsg = require('./../../helpers/utilities.helper'),
//nodemailer = require('nodemailer'),
redisHelper = require('../../helpers/redis.helper'),
sendMsg = require('./../../helpers/mail.helper'),
multer = require('multer');

// const save = require("./saveUser.helper");
const express = require("express");
const app = express();

mongoCLient.Promise = Promise;

//Validation
var checkValidation = async (req) => {
    req.checkBody('first_name', configMessage.messageConfig.validationErrMessage.first_name).notEmpty();
    req.checkBody('first_name', configMessage.messageConfig.validationErrMessage.first_name_alpha).isAlpha()//check if first_name is only string and not number
    req.checkBody('last_name', configMessage.messageConfig.validationErrMessage.last_name).notEmpty();
    req.checkBody('last_name', configMessage.messageConfig.validationErrMessage.last_name_alpha).isAlpha()
    req.checkBody('email', configMessage.messageConfig.validationErrMessage.email).notEmpty();
    req.checkBody('email', configMessage.messageConfig.emailErr.validationErr.email).isEmail();
    req.checkBody('salutation', configMessage.messageConfig.validationErrMessage.salutation).notEmpty();
    req.checkBody('salutation', configMessage.messageConfig.validationErrMessage.salutationField).optional().isIn(['Mr.', 'Mrs.', 'Ms.']);
    req.checkBody('user_role', configMessage.messageConfig.validationErrMessage.user_role).notEmpty();
    req.checkBody('user_role', configMessage.messageConfig.validationErrMessage.user_role_field).optional().isIn(['superuser', 'enduser','superadmin','normaluser','reader','writer','manager']);
    req.checkBody('password', configMessage.messageConfig.validationErrMessage.password).notEmpty();
    req.checkBody('password', configMessage.messageConfig.validationErrMessage.passwordCharacter).matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,30})");
    //req.checkBody('agree_terms_condition').notEmpty().isBoolean();
    
    const result = await req.getValidationResult();
    return result.array();
};

const saveUser = exports.saveUser = async (body) => {
    const coll = await global.db.collection("User");
    
    const salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);//generating salt
    const bPassword = await bcrypttHelper.hashPwd(body.password, salt);//hashing the password
    
    return coll.insertOne({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: bPassword,
        salutation: body.salutation,
        user_role: body.user_role,
        agree_terms_condition: body.agree_terms_condition,
        added_on: body.added_on,
        deleted: body.deleted,
        isVerified: body.isVerified,
        subscribe: body.subscribe,
        // image_path: body.image_path
    });
}


const sendingProperties = async (receivedHost, receivedEmail, receivedReq, receivedRes) => {
    try {
        if (receivedReq.route.path === "/subscribe/anonymous") {
            sendMsg.sendEmail({ sbscr: receivedHost, mail: receivedEmail }, receivedReq)
            .then(() => {
                receivedRes.status(200).json({
                    status_code: 200,
                    status: "OK",
                    message: "Subscribed Succesfully"
                })
            })
            .catch((err) => {
                receivedRes.status(400).json({
                    status_code: 400,
                    status: "Bad Request",
                    message: error
                })
            });
        } else {
            const rand = Math.floor((Math.random() * 100) + 54);//random integer
            const token = toString(rand);
            const salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);
            const emailToken = await bcrypttHelper.hashPwd(token, salt);//hashing that random number
            
            const link = `http://${host}/verify?id=${emailToken}&${email}`;
            
            const collection = global.db.collection("User");
            
            let a = await collection.findOne({ email: receivedEmail });
            //console.log(a);
            var stringA = 'email-verification_' + a._id;
            //console.log("emailToken=>", emailToken);
            redisHelper.saveToRedis(emailToken, stringA);
            redisHelper.expireKey(emailToken, 608400);//expire token after 7 days
            
            sendMsg.sendEmail({ mail: receivedEmail, lnk: link, sbscr: a.subscribe }, receivedReq);
            //sendMsg.sendEmailSES({mail:email,lnk:link});
            
            return;
        }
    } catch (err) {
        console.log(err);
    }
    
};

//creating new user
exports.create_user = async (req, res) => {
    try {
        let validation = await checkValidation(req);
        
        if (!validation.length > 0) {
            const collection = db.collection("User");
            
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const email = req.body.email;
            
            const salutation = req.body.salutation;
            const user_role = req.body.user_role;
            let agree_terms_condition = req.body.agree_terms_condition;
            
            // const salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);
            
            const password = req.body.password;
            //console.log('password ::::::::::::::::::', password);
            const subscribe = false;
            const added_on = new Date();
            const isVerified = false;
            const deleted = false;
            
            const checkEmail = await collection.findOne({ email: email });
            //console.log(checkEmail);
            if (checkEmail) {
                res.status(409).json({
                    status_code: "409",
                    status: "Conflict",
                    message: configMessage.messageConfig.emailErr.conflictMessage
                });
                //console.log(checkValidation(req));
            } else {
                agree_terms_condition = (agree_terms_condition === 'true' || agree_terms_condition === true) ? true : false;
                if (agree_terms_condition === true) {
                    try {
                        
                        let k = await saveUser({ first_name, last_name, email, password, salutation, user_role, agree_terms_condition, deleted, added_on, isVerified, subscribe});
                        const host = req.get('host');
                        
                        sendingProperties(host, email, req, res);
                        
                        res.status(200).json({
                            status_code: "200",
                            status: "Ok",
                            message: configMessage.messageConfig.user.userCreateSuccess
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).send({
                            status: "agree_terms_condition_try_catch",
                            msg: err.message
                        });
                    }
                } else {
                    res.status(400).json({
                        status_code: "400",
                        status: "Bad request",
                        message: configMessage.messageConfig.validationErrMessage.agree_terms_condition
                    });
                }
            }
        } else {
            res.status(400).json({
                status_code: "400",
                status: "Bad request",
                err: errMsg.errorMessageControl(validation)
            });
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            err: err.toString()
        });
        // next(err);
    }
};

//list of all user
exports.listOfUser = async (req, res) => {
    try {
        var request = await paginate.paginationControl(req);
        
        let paginationList = await db
        .collection("User")
        .find(
            { deleted: false },
            { projection: { _id: 1, first_name: 1, last_name: 1, email: 1 } }
        )
        .skip((request.pageNumber - 1) * request.pageSizeLimit)
        .limit(request.pageSizeLimit)
        .toArray();
        
        if (paginationList.length > 0) {
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                msg: paginationList
            });
            //console.log(userList);
            
        } else {
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                message: configMessage.messageConfig.user.getUserEmptyMessage
            });
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            msg: err
        });
    }
};

//get user by id
exports.getUserById = async (req, res) => {
    try {
        let id = ObjectID(req.params.id);
        
        let getInfo = await db.collection("User").findOne(
            { _id: id, deleted: false },
            {
                projection: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    email: 1,
                    salutation: 1,
                    user_role: 1
                }
            }
        );
        console.log(getInfo);
        if (getInfo) {
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                message: getInfo
            });
        } else {
            res.status(404).json({
                status_code: "404",
                status: "Not Found",
                message: configMessage.messageConfig.validationErrMessage.not_found
            });
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: err
        });
    }
};

//delete user (patch)
exports.deleteUser = (req, res) => {
    try {
        let id = req.params.id;
        var user = {
            deleted: true
        };
        
        db.collection("User").update(
            {
                _id: ObjectID(id)
            },
            {
                $set: user
            },
            (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({
                    status_code: "200",
                    status: "Ok",
                    message: configMessage.messageConfig.user.userDeleteMsg
                });
            }
        );
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: err
        })
    }
};

//update user
exports.updateUser = async (req, res) => {
    try {
        let validation = await checkValidation(req);
        //console.log(validation);
        if (!validation.length > 0) {
            let id = req.params.id;
            var user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                salutation: req.body.salutation,
                user_role: req.body.user_role,
                password: req.body.password
            };
            
            if (req.file) {
                const image = req.file.myfile;
                user.image = image;
                user.image_path = req.file.path;
            }
            
            let k = await db.collection("User").updateOne({
                _id: ObjectID(id)
            }, {
                $set: user
            }, (err, result) => {
                if (err) {
                    res.json(err);
                }
                if (result.result.nModified === 1) {
                    res.status(200).json({
                        status_code: "200",
                        status: "Ok",
                        message: configMessage.messageConfig.user.userUpdateMsg
                    });
                } else {
                    res.status(200).json({
                        status_code: "200",
                        status: "OK",
                        message: "No changes made"
                    })
                }
                
            });
        } else {
            res.status(400).json({
                status_code: "400",
                status: "Bad request",
                error: errMsg.errorMessageControl(validation)
            });
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: err
        });
    }
};

//Email Verifications
exports.verifyEmail = async (req, res) => {
    try { 
        
        let id = req.query.id;
        let tokenVerify = await redisHelper.fetchData(id);
        
        if(tokenVerify=== null){
            return res.status(401)
            .json( configMessage.messageConfig.user.alreadyVerified);
        }
        let b = tokenVerify.split('_');
        
        const findEmail = await db.collection('User').findOne(
            {
                _id:ObjectID(b[1]),
                email : b[2]
            },
            
            {
                projection:{
                    _id:1,
                    email: 1,
                    isVerified: 1  
                }
            })
            
            const updateRes = await db.collection('User').updateOne({
                _id: ObjectID(b[1])
            }, {
                $set: 
                {isVerified: true}
                
            });
            if (updateRes.result.n > 0) {
                redisHelper.delkey(id);
                res.status(200)
                .json( configMessage.messageConfig.user.userVerifiedMsg);
                
            }  else{
                res.status(304)
                .json( configMessage.messageConfig.user.userNotVerified );
            }
            
            
        } catch (error) {   
            next(err);
        }   
    }
    
    
    
    //Resend Token
    exports.resendToken = async (req, res) => {
        
        try {
            let user = await db.collection("User").findOne({ _id: id });
            if (user && user.user_role === "superuser") {
                let unverified_user = await db.collection("User").find({ isVerified: false }, { projection: { email: 1 } }).toArray();
                unverified_user.forEach(element => {
                    
                    const host = req.get('host');
                    
                    sendingProperties(host,user,element.email);
                    
                    res.status(200).json({
                        status: "Resending token",
                        message: "Token successfully sent"
                    });
                    
                });
            } else if (user && user.user_role != "superuser") {
                
                let unverified_user = await db.collection("User").findOne({ isVerified: false }, { projection: { email: 1 } });
                
                const host = req.get('host');
                
                sendingProperties(host,unverified_user,unverified_user.email);
                res.status(200).json({
                    status: "Resending token",
                    message: "Token successfully sent"
                });
            } else {
                
                res.status(400).json({ status: "Bad Request", msg: "Unverified user" });
                
            }
            
        } catch (err) {
            res.status(400).json({ status: "Bad Request", msg: err });
        }
        
    }
    
    exports.anonymousUser = async (req, res) => {
        
        try {
            console.log("I am here");
            let email = await req.body.email;
            let k = await global.db.collection("AnonymousUser").insertOne({ email: email, subscribe: true });
            //console.log("inserted",k);
            let ka = await global.db.collection("AnonymousUser").findOne({ email: email });
            sendingProperties(ka.subscribe, email, req, res);
        } catch (err) {
            res.status(400).json(err);
        }
        
    };
    
    exports.unsubscribe = async (req, res) => {
        let id = ObjectID(req.params.id);
        var anonUser = {
            subscribe: false
        };
        
        global.db.collection("AnonymousUser").update(
            {
                _id: id
            },
            {
                $set: anonUser
            }, (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                
                res.status(200).json({
                    status_code: "200",
                    status: "Ok",
                    message: result
                });
            }
        );
    }
    