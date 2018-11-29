((redisConnector)=> {
    const redis = require('redis');
    const redisconfig = require('../configs/redis.config');
    redisConnector.init = async (app) =>{
    const redisClient = redis.createClient({host: redisconfig.host, port:redisconfig.port});
       await redisClient.on('ready',function(){
            console.log("Redis Server is ready");
        });
        
        await redisClient.on('error', function(){
            console.log("Error in Reddis Server Connection");
        });
    }

redisConnector.set = (key, data) => {
   // let doc = JSON.parse(reply);
    redis.set(cachekey,Json.stringify(data))

}
     })(module.exports);