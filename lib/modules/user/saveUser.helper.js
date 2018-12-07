
exports.saveUser = async (body) => {

    // var bcrypttHelper = require('./../../helpers/bcrypt.helper');
    // var salt = await bcrypttHelper.generateSalt(BCRYPT_SALT_ROUNDS);
    // var pss = require("./../../modules/user/config");

    // var password = await bcrypttHelper.hashPwd(pss.messageConfig.default_super_user.password, salt);

    return db.collection("User").insertOne({ body });

}

