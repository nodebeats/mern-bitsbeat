const ObjectID = require('mongodb').ObjectID,
      util = require('../../commons/util');


exports.logout_user = async (req, res, next) => {


    console.log('req.decodedUser', req.decodedUser.userId);
    
    
    let collection = global.db.collection("User");
    try {
        let deleteJWT = await collection.update({_id:ObjectID(req.decodedUser.userId)},{ $unset:{ jwtToken:""}});
        res.json(util.renderApiData(req,res,'200','Successfully logout',{}));
        

    } catch (error) {
        next(error);
    }








}