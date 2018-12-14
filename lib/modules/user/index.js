const BCRYPT_SALT_ROUNDS = 10,
bcrypttHelper = require("../../helpers/bcrypt.helper"),
mongoCLient = require("mongodb").MongoClient,
ObjectID = require("mongodb").ObjectID,
configMessage = require("./config"),
paginate = require("./../../helpers/utilities.helper"),
errMsg = require("./../../helpers/utilities.helper"),
redisHelper = require('./../../helpers/redis.helper');
nodemailer = require("nodemailer");
// const save = require("./saveUser.helper");
const express = require("express");
const app = express();

mongoCLient.Promise = Promise;

//Validation
var checkValidation = async req => {
    req
    .checkBody(
        "first_name",
        configMessage.messageConfig.validationErrMessage.first_name
    )
    .notEmpty();
    req
    .checkBody(
        "first_name",
        configMessage.messageConfig.validationErrMessage.first_name_alpha
    )
    .isAlpha();
    req
    .checkBody(
        "last_name",
        configMessage.messageConfig.validationErrMessage.last_name
    )
    .notEmpty();
    req
    .checkBody(
        "last_name",
        configMessage.messageConfig.validationErrMessage.last_name_alpha
    )
    .isAlpha();
    req
    .checkBody("email", configMessage.messageConfig.validationErrMessage.email)
    .notEmpty();
    req
    .checkBody(
        "email",
        configMessage.messageConfig.emailErr.validationErr.email
    )
    .isEmail();
    req
    .checkBody(
        "salutation",
        configMessage.messageConfig.validationErrMessage.salutation
    )
    .notEmpty();
    req
    .checkBody(
        "salutation",
        configMessage.messageConfig.validationErrMessage.salutationField
    )
    .optional()
    .isIn(["Mr.", "Mrs.", "Miss"]);
    req
    .checkBody(
        "user_role",
        configMessage.messageConfig.validationErrMessage.user_role
    )
    .notEmpty();
    req
    .checkBody(
        "user_role",
        configMessage.messageConfig.validationErrMessage.user_role_field
    )
    .optional()
    .isIn(["superuser", "enduser"]);
    req
    .checkBody(
        "password",
        configMessage.messageConfig.validationErrMessage.password
    )
    .notEmpty();
    req
    .checkBody("agree_terms_condition")
    .notEmpty()
    .isBoolean();
    
    const result = await req.getValidationResult();
    return result.array();
};

const createRandNumber = () => {
    const rand = Math.floor(Math.random() * 100 + 54); //random integer
    return rand;
};

//creating new user
exports.create_user = async (req, res, next) => {
    try {
        let validation = await checkValidation(req);
        
        if (!validation.length > 0) {
            const collection = db.collection("User");
            
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const email = req.body.email;
            
            const salutation = req.body.salutation;
            const user_role = req.body.user_role;
            const agree_terms_condition = req.body.agree_terms_condition;
            
            const salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);
            
            const password = await bcrypttHelper.hashPwd(req.body.password, salt);
            //console.log('password ::::::::::::::::::', password);
            const added_on = new Date();
            
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
                if (agree_terms_condition === true) {
                    try {
                        let data = collection.insertOne({
                            first_name,
                            last_name,
                            email,
                            password,
                            salutation,
                            user_role,
                            agree_terms_condition,
                            deleted,
                            added_on
                        });
                        
                        const rand = createRandNumber(); //random integer
                        const token = toString(rand);
                        const tokenVerif = await bcrypttHelper.hashPwd(token, salt); //hashing that random number
                        //console.log(tokenVerif);
                        const host = req.get("host");
                        const link = "http://" + host + "/verify?id=" + tokenVerif;
                        //console.log("host => ", req.get('host'));
                        const tokenCollection = db.collection("Token");
                        //inserting the token into the database
                        await tokenCollection.insertOne({
                            user_email: email,
                            token: tokenVerif,
                            created_at: new Date(),
                            expires: 43200
                        });
                        //console.log(tokenCollection);
                        //Generating test SMT service account from ethreal.email
                        //it is used when we don't have a real mail account for testing
                        nodemailer.createTestAccount((err, account) => {
                            //create reusable transporter object using defaut SMTP transport
                            let transporter = nodemailer.createTransport({
                                host: "smtp.ethereal.email",
                                port: 587,
                                secure: false,
                                auth: {
                                    user: account.user,
                                    pass: account.pass
                                }
                            });
                            //setting up email data
                            let mailOptions = {
                                from: "someone@exapmle.com", //sender address
                                to: email, //receiver
                                subject: "User confirmation",
                                text:
                                `You are succesfully signed up. Click this link to verify your email ` +
                                link
                                // html:'<b></b>'
                            };
                            //send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                //console.log(info);
                                console.log("Message sent : %s", info.messageId);
                                //Preview only available when sending through an Ethreal account
                                console.log(
                                    "Preview URL: %s",
                                    nodemailer.getTestMessageUrl(info)
                                );
                            });
                        });
                        
                        res.status(200).json({
                            status_code: "200",
                            status: "Ok",
                            message: configMessage.messageConfig.user.userCreateSuccess
                        });
                    } catch (err) {
                        res.status(500).send({
                            status: "agree_terms_consdition_try_catch",
                            msg: err.message
                        });
                    }
                } else {
                    res.status(400).json({
                        status_code: "400",
                        status: "Bad request",
                        message:
                        configMessage.messageConfig.validationErrMessage
                        .agree_terms_condition
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
            { projection: { _id: 1, first_name: 1, last_name: 1 } }
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
                msg: "There are no user to display"
            });
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            msg: "Bad request"
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
            message: getInfo
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
            err: err
        });
    }
};

//update user
exports.updateUser = (req, res) => {
    try {
        let id = req.params.id;
        var user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            salutation: req.body.salutation,
            user_role: req.body.user_role
        };
        
        db.collection("User").update({_id: ObjectID(id)},{$set: user},(err, result) => {
            if (err) {
                res.json(err);
            }
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                message: configMessage.messageConfig.user.userUpdateMsg
            });
        }
    );
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
    const tokenCollection = db.collection("Token");
    // If we found a token, find a matching user
    if(req.query.id == Token)
    {      
    tokenCollection.findOne({ token: req.query.id},(err, user) => {
        if (err)
        {return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token."
        });
    } 
    if (user.user_id)
    {   
        const myUser = db.collection("User");
        let verify =  myUser.updateOne({_id:user.user_id,isVerified:false},{$set:{isVerified:true}},{projection:{  email:1,user_id:1 }})
        console.log(verify);
        if(isVerified == true)
        {
            return res
            .status(200)
            .send({
                type: "Not verified",
                msg: "This user has not already been verified."
            });
        }else{
            return res
            .status(400)
            .send({
                type: "already-verified",
                msg: "This user has already been verified."
            });
        }
        
    }
    
    // // Verify and save the user
    // user.isVerified = true;
    // user.save(function(err) {
    //     if (err) {
    //         return res.status(500).send({ msg: err.message });
    //     }
    //     res.status(200).send("The account has been verified. Please log in.");
    // });
});
}
};
