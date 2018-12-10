const jwt = require('jsonwebtoken');
const config = require('../configs/app.config');
// const redisHelper = require('../helpers/redis.helper');


//Generating JWT 
exports.generateToken = (userId) => {
   let token = jwt.sign(userId, config.privateKey);
  return token; //return token

}


