var bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 10;

exports.generateSalt = (salt) => {

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt, (err, salted_val) => {
            if (err) reject(err);
            resolve(salted_val);
            console.log(salted_val, "SALT");
        });
    });

};


exports.hashPwd = (value, saltStr) => {
    console.log('value, typeof', value, typeof value);
    console.log(saltStr, typeof saltStr);
    return new Promise((resolve, reject) => {
        //let salt = generateSalt(BCRYPT_SALT_ROUNDS)
        bcrypt.hash(value, saltStr, (err, hashValue) => {
            if (err) {
                reject(err);
            }
            resolve({ hashValue });
            console.log(hashValue, "-HASH");
        });
    });
}