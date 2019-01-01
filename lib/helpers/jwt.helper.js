const jwt = require('jsonwebtoken');
const config = require('../configs/app.config');
// const redisHelper = require('../helpers/redis.helper');


//Generating JWT 
exports.generateToken = (userId) => {
   let token = jwt.sign({userId}, config.privateKey,{
     expiresIn:'10 days',
     issuer:userId.toString()
   });
  return token; //return token

}


