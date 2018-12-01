const BCRYPT_SALT_ROUNDS = 10;
var bcrypttHelper = require('../../helpers/bcrypt.helper')
var mongoCLient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// var configMessage = require("./config");

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

    collection.findOne({ email: email })
        .then((email) => {
            if (email) {
                res.status(409).json({
                    status: "Conflict Error",
                    message: "Email Already Exists"
                });
                return;
            }
        });

    collection.insertOne({ first_name, last_name, email, password, salutation, user_role, agree_terms_condition, deleted })
        .then((data) => {
            //console.log(data);
            res.json({ "message": "inserted" });
        })
        .catch((err) => {
            //console.log(err);
            res.json({ "message": "not inserted" });
        });
}

exports.listOfUser = (req, res) => {

    db.collection('User').find().toArray((err, results) => {
        res.send(results)
    });

}

exports.getUserById = (req, res) => {
    let id = ObjectID(req.params.id);
    db.collection('User').find(id).toArray((err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    });
};

exports.deleteUser = (req, res) => {

        let id = req.params.id;
    

    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        salutation: req.body.salutation,
        user_role: req.body.user_role,
        deleted: true
    };

    db.collection("User").update({
        _id: ObjectID(id)
    }, {
            $set:user
        }, (err, result) => {
            if (err) {
                throw err;
            }
            res.send('User deleted sucessfully');
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
            res.send('User updated sucessfully');
        });
}



