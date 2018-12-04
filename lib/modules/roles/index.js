const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID;

  


//Create of roleRole
exports.addRole = async (req, res, next) => {
  if (!req.body.roleName || !req.body.description) {
    return res.status(400).send({
      message: "This field cannot be empty.Please fill up the form!"
    });
  }
  let role = {
    roleName: req.body.roleName,
    description: req.body.description,
    added_on: new Date(),
    deleted: false
  };

  const createrole = await db.collection("role").insertOne(role, (err, result) => {
      if (err) {
        console.log(err);
      }

      res.json({
        message: "Role created Successfully!"
    })    
  });
};


//Reading of roleRole
exports.readRole = async (req, res) => {
  let roleList = await db.collection('role').find({deleted:false}, { projection: { _id: 1, roleName: 1, description: 1, added_on:1 } }).toArray();
  let sortList =await db.collection('role').find( ).sort( { roleName: -1 } )
  // const listRole = await db
  //   .collection("role")
  //   .find()
  //   .toArray((err, results) => {
  //     res.send(results);
  //   });
  if(roleList.length > 0){
    res.json(roleList);
  }
  else{
    res.json({"message": "There is no any user list"})
  }
};

//Reading By id

exports.readroleById = async (req, res, next) => {
  let id = ObjectID(req.params.id);
  const listById = await db
    .collection("role")
    .find(id)
    .toArray((err, result) => {
      if (err) {
        throw err;
      }

      res.send(result);
    });
};

//Updating by id

exports.UpdateById = async (req, res, next) => {
  let id = req.params.id;
  let role = {
    roleName: req.body.roleName,
    description: req.body.description,
    added_on: req.body.added_on
  };

  const putById = await db
    .collection("role")
    .updateOne({ _id: ObjectID(id) }, { $set: role }, (err, result) => {
      if (err) {
        return console.error(err);
      }
      res.json({
        message: "Updates Successfully!"
    })
    });
};

//Deleting by id
exports.deleteById = (req, res, next) => {  
  // let collection = global.db.collection("role");
  let id = req.params.id;
  let role = {
    roleName: req.body.roleName,
    description: req.body.description,
  
  };

db.collection.updateOne({_id: ObjectID(id)}, {$set:{deleted:true}}, (err, data) => {
  if (err) return next(err);

  if (data) {
      res.json({
          message: "Deleted Successfully!"
      })
  }

});
}
