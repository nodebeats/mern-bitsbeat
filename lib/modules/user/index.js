const BCRYPT_SALT_ROUNDS = 10;
var bcrypttHelper = require('../../helpers/bcrypt.helper');
var mongoCLient = require('mongodb').MongoClient;

mongoCLient.Promise = Promise;

exports.create_user = async (req, res) => {
    // check();
    var collection = global.db.collection("User");

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;

    var salutation = req.body.salutation;
    var user_role = req.body.user_role;
    var agree_terms_condition = req.body.agree_terms_condition;




    var salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);

    var password = await bcrypttHelper.hashPwd(req.body.password, salt);
    console.log('password ::::::::::::::::::', password);



    const findEmail = await collection.findOne({ email: email });
    
    if(findEmail){
        return  res.status(409).json({
            status: "Conflict Error",
            message: "Email Already Exists"
        });
    } else{
        collection.insertOne({ first_name, last_name, email, password, salutation, user_role, agree_terms_condition,setBit: false })
        .then((data) => {
            // console.log(data);
            res.send("Posted!!");
        })
        .catch((err) => {
            console.log(err);
        });

    }
       


       



}