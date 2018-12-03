const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID,
  helper = require("../../helpers/db.helper");

//Create of userRole
exports.addPolicy = (req, res, next) => {
    let policy = {
        policy_title: req.body.policy_title,
        policy_route: req.body.policy_route,
        policy_description: req.body.policy_description,
        deleted: false,
    };

  db.collection("policy").insertOne(policy, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send("Added successfully");
  });
};

//Reading of userRole
exports.getPolicy = (req, res) => {
  db.collection("policy").find().toArray((err, results) => {
    if (err) {
      console.log(err);
  }
//   results.forEach(element => {
//     if (element.deleted != true) {
//         res.write(JSON.stringify({
//             "policy_title": req.body.policy_title,
//             "policy_route": req.body.policy_route,
//             "policy_description": req.body.policy_description
//         }));
//     }
// });
//res.end(results);
      res.send(results);
    });
};

//Reading By id
exports.getById = (req, res, next) => {
  let id = ObjectID(req.params.id);
  db.collection("policy")
    .find(id)
    .toArray((err, result) => {
      if (err) {
        throw err;
      }

      res.send(result);
    });
};

//Updating by id

exports.updateById = (req, res, next) => {
  let id = req.params.id;
  let policy = {
    policy_title: req.body.policy_title,
    policy_route: req.body.policy_route,
    policy_description: req.body.policy_description,

};

  db.collection("policy").updateOne(
    { _id: ObjectID(id) },
    { $set: policy },
    (err, result) => {
      if (err) {
        return console.error(err);
      }
      res.send("Policy updated sucessfully");
    }
  );
};

exports.deleteById = (req,res,next) => {

  let id = req.params.id;
  let policy = {
    policy_title: req.body.policy_title,
    policy_route: req.body.policy_route,
    policy_description: req.body.policy_description,

};

  db.collection("policy").remove({
      _id: ObjectID(id)
  }, {
          $set: policy
      }, (err, result) => {
          if (err) {
              throw err;
          }
          res.send('User deleted sucessfully');
      });
}

exports.patchById = (req, res) => {

  let id = req.params.id;
  let policy = {
    policy_title: req.body.policy_title,
    policy_route: req.body.policy_route,
    policy_description: req.body.policy_description,
    deleted: true,

};
  db.collection("policy").update({
      _id: ObjectID(id)
  }, {
          $set: policy
      }, (err, result) => {
          if (err) {
              throw err;
          }
          res.send('User deleted sucessfully');
      });
}