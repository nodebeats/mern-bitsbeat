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
        //Verifying token
        try {

            let decoded = jwt.verify(findToken.jwtToken, config.privateKey);

        
            res.json({
                message: "Logged out",
                val :decoded
            });

            
            // res.json(decode);
        //   const data= jwt.verify(, config.privateKey);

        } catch (error) {
            next(error);
            //Token Expired Logic
            // if (error.name = "TokenExpiredError") {
            //   return res.json({
            //     message: "Sorry, your token is expired, please generate a new token"
            //   })
            // } 

        }

    } catch (error) {
        next(error);
    }

}