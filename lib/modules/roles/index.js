var mongoClient = require('Mongodb').mongoClient;
var collection = req.db.collection("User");

// mongoClient.promise = promise;

exports.createRole =(req,res,next) => {
    var roleName = req.body.roleName;
    var description = req.body.description;
    var added_on = req.body.added_on;
    var listRoles = req.body.listRoles;
    var getRoleDetail = req.body.getRoleDetail;
    var updateRole = req.body.updateRole;
    var deleteRole = req.body.deleteRole;

}

