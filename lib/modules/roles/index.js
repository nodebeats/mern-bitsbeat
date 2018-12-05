const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID;

//Create of roleRole
exports.addRole = async (req, res, next) => {
  try {
    const findRole = await db
      .collection("role")
      .findOne({ roleName: req.body.roleName });
    if (findRole) {
      return res.status(409).json({
        code: 409,
        status: "Conflict",
        message: "RoleName is already existed!"
      });
    } else {
      let role = {
        roleName: req.body.roleName,
        description: req.body.description,
        added_on: new Date(),
        deleted: false
      };

      try {
        const createrole = await db.collection("role").insertOne(role);
        res.json({
          message: "Role created Successfully!"
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//Reading of roleRole
exports.readRole = async (req, res) => {
  try {
    const roleList = await db
      .collection("role")
      .find(
        { deleted: false },
        { projection: { _id: 1, roleName: 1, description: 1, added_on: 1 } }
      )
      .sort({ added_on: -1 })
      .toArray();

    if (roleList.length > 0) {
      res.json(roleList);
    } else {
      res.json({ message: "There is no any user list" });
    }
  } catch (err) {
    console.log(err);
  }
};

//Reading By id

exports.readroleById = async (req, res, next) => {
  try {
    let id = ObjectID(req.params.id);
    const listById = await db
      .collection("role")
      .find(id)
      .toArray((err, result) => {
        if (err) {
          //throw err;
          console.log(err);
        } else {
          res.send(result);
        }
      });
  } catch (err) {
    console.log(err);
  }
};

//Updating by id

exports.UpdateById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let role = {
      roleName: req.body.roleName,
      description: req.body.description,
      added_on: new Date()
    };

    const putById = await db
      .collection("role")
      .updateOne({ _id: ObjectID(id) }, { $set: role }, (err, result) => {
        if (err) {
          return console.error(err);
        }
        res.json({
          message: "Updates Successfully!"
        });
      });
  } catch (err) {
    console.log(err);
  }
};

//Deleting by id
exports.deleteById = (req, res, next) => {
  try {
    let collection = global.db.collection("role");
  let id = req.params.id;

  collection.updateOne(
    { _id: ObjectID(id) },
    { $set: { deleted: true } },
    (err, data) => {
      if (err) return next(err);

      if (data) {
        res.json({
          message: "Deleted Successfully!"
        });
      }
    }
  );
  } catch (err) {
    console.log(err);
  }
};
