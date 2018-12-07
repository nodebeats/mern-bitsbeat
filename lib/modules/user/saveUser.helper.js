
exports.saveUser = async (db) => {
    
    var bcrypttHelper = require("./../../helpers/bcrypt.helper");
    const BCRYPT_SALT_ROUNDS = 10;

    var coll = db.collection("User");

    var pass = default_user.messageConfig.default_super_user.default_super_user_password;
    var body = default_user.messageConfig.default_super_user.default_super_user;
    var salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);

    let k = coll.findOne({user_role:"superuser"});
    
    if(!k){
        console.log("I am here Super admin");
        var default_user = require("./../../modules/user/config");

        let bPassword = await bcrypttHelper.hashPwd(pass,salt);
        // coll.insertOne({body,password:bPassword});
        console.log({body,password:bPassword});
    }

}

