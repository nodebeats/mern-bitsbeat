
exports.saveUser = async (db) => {
    
    var bcrypttHelper = require("./../../helpers/bcrypt.helper");
    const BCRYPT_SALT_ROUNDS = 10;

    var coll = db.collection("User");

    let k = await coll.findOne({user_role:"superuser"});
    //console.log(k);
    
    if(!k){
        var default_user = require("./../../modules/user/config");
        var pass = await (default_user.messageConfig.default_super_user.default_super_user_password).toString();
        var body = await default_user.messageConfig.default_super_user.default_super_user;
        var salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);
        console.log(typeof salt, typeof pass);
        var bPassword = await bcrypttHelper.hashPwd(pass,salt);
        
        coll.insertOne({first_name:body.first_name,last_name:body.last_name,email:body.email,password:bPassword,salutation:body.salutation,user_role:body.user_role,agree_terms_condition:body.agree_terms_condition,added_on:body.added_on});
        //console.log({body,password:bPassword});
    }

}

