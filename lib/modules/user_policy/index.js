//var objectId = require('mongodb').ObjectID;

var ObjectID = require('mongodb').ObjectID;

//Adding a Policy
//app.post('/policy/add',

exports.addPolicy= (req, res, next) => {
    // console.log('req => ', req.dbCon);
    
    // let dbase = req.dbCon;
    let policy = {
        policy_title: req.body.policy_title,
        policy_route: req.body.policy_route,
        policy_description: req.body.policy_description,
    //    listAppPolicies = req.body.listAppPolicies,
    //    updateAppPolicy = req.body.updateAppPolicy,
     //   removeAppPolicy = req.body.removeAppPolicy
    };
    //Saving the created Policy 
    db.collection("policy").save(policy, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send('Policies are added succesfully');
    });
};
//Getting all the polices
//app.put('/getAllPolicy', 

exports.getPolicy = (req, res) => {
  //  let dbase = req.dbCon;
    db.collection('policy').find().toArray((err, results) => {
        res.send(results)
    });
};
//Getting the policy by ID 
//app.get('/policy/:id', 
exports.getById = (req, res, next) => {
   // let dbase = req.dbCon;
    if (err) {
        throw err;
    }

    let id = ObjectID(req.params.id);
    db.collection('policy').find(id).toArray((err, result) => {
        if (err) {
            throw err;
        }
        res.send(result);
    });
};
// Updating by Id

//app.put('/policy/update/:id', 

exports.updateById = (req, res, next) => {
  //  let dbase = req.dbCon;
    let id = {
        _id: ObjectID(req.params.id)
    };

    var policy = {
        policy_title : req.body.policy_title,
        policy_route : req.body.policy_route,
        policy_description : req.body.policy_description,
        // listAppPolicies = req.body.listAppPolicies,
        // updateAppPolicy = req.body.updateAppPolicy,
        // removeAppPolicy = req.body.removeAppPolicy
    };
    db.collection("policy").update({
        _id: id
    }, {
        $set: policy
    }, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Policy updated sucessfully');
    });
};

//Deleting by Id

//app.delete('/policy/delete/:id', 
exports.deleteById = (req, res, next) => {
    let dbase = req.dbCon;
    let id = ObjectID(req.params.id);
    dbase.collection("policy").deleteOne(id, (err, result) => {
        if (err) {
            throw err;
        }
        res.send('user deleted');
    });
};
