const BCRYPT_SALT_ROUNDS = 10,
    bcrypttHelper = require('../../helpers/bcrypt.helper'),
    mongoCLient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    configMessage = require("./config"),
    paginate = require('./../../helpers/utilities.helper'),
    errMsg = require('./../../helpers/utilities.helper'),
    nodemailer = require('nodemailer');
// const save = require("./saveUser.helper");

mongoCLient.Promise = Promise;

//Validation
var checkValidation = async (req) => {
    req.checkBody('first_name', configMessage.messageConfig.validationErrMessage.first_name).notEmpty();
    req.checkBody('first_name', configMessage.messageConfig.validationErrMessage.first_name_alpha).isAlpha()
    req.checkBody('last_name', configMessage.messageConfig.validationErrMessage.last_name).notEmpty();
    req.checkBody('last_name', configMessage.messageConfig.validationErrMessage.last_name_alpha).isAlpha()
    req.checkBody('email', configMessage.messageConfig.validationErrMessage.email).notEmpty();
    req.checkBody('email', configMessage.messageConfig.emailErr.validationErr.email).isEmail();
    req.checkBody('salutation', configMessage.messageConfig.validationErrMessage.salutation).notEmpty();
    req.checkBody('salutation', configMessage.messageConfig.validationErrMessage.salutationField).optional().isIn(['Mr.', 'Mrs.']);
    req.checkBody('user_role', configMessage.messageConfig.validationErrMessage.user_role).notEmpty();
    req.checkBody('user_role', configMessage.messageConfig.validationErrMessage.user_role_field).optional().isIn(['superuser', 'enduser']);
    req.checkBody('password', configMessage.messageConfig.validationErrMessage.password).notEmpty();
    req.checkBody('agree_terms_condition').notEmpty().isBoolean();

    const result = await req.getValidationResult();
    return result.array();
};

//creating new user
exports.create_user = async (req, res, next) => {
    try {
        let validation = await checkValidation(req);

        if (!validation.length > 0) {
            const collection = db.collection("User");
            const tokenCollection = db.collection("Token");

            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const email = req.body.email;

            const salutation = req.body.salutation;
            const user_role = req.body.user_role;
            const agree_terms_condition = req.body.agree_terms_condition;

            const salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);

            const password = await bcrypttHelper.hashPwd(req.body.password, salt);
            //console.log('password ::::::::::::::::::', password);
            const addedOn = new Date();

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
                    collection.insertOne({ first_name, last_name, email, password, salutation, user_role, agree_terms_condition, deleted, addedOn })
                        .then((data,err) => {
                            if(err) {return res.status(500).send({ msg: err.message });}

                            // tokenCollection.insertOne({_userId:data._id,token:})

                            //Generating test SMT service account from ethreal.email
                            //it is used when we don't have a real mail account for testing
                            nodemailer.createTestAccount((err,account) => {
                                //create reusable transporter object using defaut SMTP transport
                                let transporter = nodemailer.createTransport({
                                    host:'smtp.ethereal.email',
                                    port:587,
                                    secure:false,
                                    auth:{
                                        user:account.user,
                                        pass:account.pass
                                    }
                                });
                                //setting up emial data
                                let mailOptions = {
                                    from:'someone@exapmle.com',//sender address
                                    to:email,//receiver
                                    subject:'User confirmation',
                                    text:'You are succesfully signed up',
                                    // html:'<b>Hello world?</b>'
                                };
                                //send mail with defined transport object
                                transporter.sendMail(mailOptions,(error,info) => {
                                    if(error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent : %s',info.messageId);
                                    //Preview only available when sending through an Ethreal account
                                    console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
                                    
                                })
                            })
                        })
                        .then((data) => {
                            res.status(200).json({
                                status_code: "200",
                                status: "Ok",
                                message: configMessage.messageConfig.user.userCreateSuccess
                            });
                        })
                        .catch((err) => {
                            res.json(err);
                        });
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

        let paginationList = await db.collection('User').find({ deleted: false }, { projection: { _id: 1, first_name: 1, last_name: 1 } }).skip((request.pageNumber - 1) * request.pageSizeLimit).limit(request.pageSizeLimit).toArray();

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
}

//get user by id
exports.getUserById = async (req, res) => {
    try {
        let id = ObjectID(req.params.id);

        let getInfo = await db.collection('User').findOne({ _id: id, deleted: false }, { projection: { _id: 1, first_name: 1, last_name: 1, email: 1, salutation: 1, user_role: 1 } });
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
            })
        }
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: getInfo
        });
    }
}

//delete user (patch)
exports.deleteUser = (req, res) => {
    try {
        let id = req.params.id;
        var user = {
            deleted: true
        };

        db.collection("User").update({
            _id: ObjectID(id)
        }, {
                $set: user
            }, (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({
                    status_code: "200",
                    status: "Ok",
                    message: configMessage.messageConfig.user.userDeleteMsg
                });
            });
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            err: err
        })
    }
}

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

        db.collection("User").update({
            _id: ObjectID(id)
        }, {
                $set: user
            }, (err, result) => {
                if (err) {
                    res.json(err);
                }
                res.status(200).json({
                    status_code: "200",
                    status: "Ok",
                    message: configMessage.messageConfig.user.userUpdateMsg
                });
            });
    } catch (err) {
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: err
        });
    }
}



