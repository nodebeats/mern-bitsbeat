exports.authorize = async (req, res, next) => {
    const ObjectID = require('mongodb').ObjectID;

    const collection = global.db.collection('User');
    console.log('req.decodedUser', req.decodedUser.userId);
    
   
   const data = await collection.findOne({_id:ObjectID(req.decodedUser.userId)}, { projection: { _id: 1, first_name: 1, last_name: 1, email: 1, salutation: 1, user_role: 1 } });
   console.log(data.user_role);
    
   if(data.user_role === "superuser"){
       return next();
   }else{
    return res.json({
        code: 401,
        status: "Unauthorized",
        message: "Sorry, you are not authorized to perform this task"
    });
   }


}
