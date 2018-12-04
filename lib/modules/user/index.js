const BCRYPT_SALT_ROUNDS = 10;
var bcrypttHelper = require('../../helpers/bcrypt.helper')
var mongoCLient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var configMessage = require("./config");

mongoCLient.Promise = Promise;

// let checkValidation = async (req) => {
//     req.checkBody('first_name', configMessage.message.user.validationErrMessage.first_name).notEmpty();
//     req.checkBody('email', configMessage.message.user.validationErrMessage.email).isEmail();

//     const result = await req.getValidationResult();
//     //console.log("result =>", result, "////////////////////////");
//     return result.array();
// };

exports.create_user = async (req, res, next) => {
    //checkValidation();
    var collection = db.collection("User");

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;

    var salutation = req.body.salutation;
    var user_role = req.body.user_role;
    var agree_terms_condition = req.body.agree_terms_condition;

    var salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);

    var password = await bcrypttHelper.hashPwd(req.body.password, salt);
    //console.log('password ::::::::::::::::::', password);

    var deleted = false;

    const checkEmail = await collection.findOne({ email: email });
    console.log(checkEmail);
    if (checkEmail) {
        res.json(configMessage.messageConfig.emailErr.conflictMessage);
    } else {
        collection.insertOne({ first_name, last_name, email, password, salutation, user_role, agree_terms_condition, deleted })
            .then((data) => {
                res.json(configMessage.messageConfig.user.userCreateSuccess);
            })
            .catch((err) => {
                res.json(err);
            });
    }
};

exports.listOfUser = async (req, res) => {

    let n = parseInt(req.query.n);

    
        
        let userList = await db.collection('User').find({deleted:false}, { projection: { _id: 1, first_name: 1, last_name: 1 } }).toArray();
        let numberOfPages = (userList.length/2);
        console.log(numberOfPages);
        let pageinationList = await db.collection('User').find({deleted:false}, { projection: { _id: 1, first_name: 1, last_name: 1 } }).skip(numberOfPages*(n-1)).limit(2).toArray();
        
        // if (userList.length > 0) {
            res.json(pageinationList);
            //console.log(userList);
       
    
   
}

exports.getUserById = async (req, res) => {
    let id = ObjectID(req.params.id);

    let getInfo = await db.collection('User').findOne({_id:id, deleted: false}, {projection:{_id:1,first_name:1,last_name:1,email:1,salutation:1,user_role:1}} );
    console.log(getInfo);
    if(getInfo){
        res.json(getInfo);
    }
}

exports.deleteUser = (req, res) => {

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
            res.send(configMessage.messageConfig.user.userDeleteMsg);
        });
}

exports.updateUser = (req, res) => {
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
                throw err;
            }
            res.send(configMessage.messageConfig.user.userUpdateMsg);
        });
}



