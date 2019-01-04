const jwt = require('jsonwebtoken');
const config = require('../configs/app.config');


//Verifying JWT
exports.checkToken = async (req, res, next) => {


    const hToken = req.headers['x-auth-token'];
    let collection = global.db.collection("User");


    try {
        //Checking token exists in Database
        const findToken = await collection.findOne({ jwtToken: hToken });
        if (!findToken) return res.json({
            code: 401,
            message: "Access Denied, No token provided"
        })


        console.log("......................" + findToken.jwtToken);
        
        try {

            let decoded =  jwt.verify(findToken.jwtToken, config.privateKey);
            console.log(decoded);

            //Setting decoded value in Request Object
            req.decodedUser= decoded;
   
            //pass to next middleware
            next();
             
          


        } catch (error) {
            //Token Expired Logic
            if (error.name == "TokenExpiredError") {
                return res.json({
                  message: "Sorry, your token is expired, please generate a new token"
                })
              }
              
              next(error);

        }

    } catch (error) {
        next(error);
    }

}
