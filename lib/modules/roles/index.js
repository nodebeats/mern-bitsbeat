const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID,
  paginate = require("./../../helpers/utilities.helper");

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
        policy_title:req.body.policy_title,
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
    const pageNumberReq = await paginate.paginationControl(req);

    const roleList = await db
      .collection("role")
      .find(
        { deleted: false },
        { projection: { _id: 1, roleName: 1, description: 1,policy_title:1, added_on: 1 } }
      )
      .sort({ added_on: -1 })
      .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
      .limit(pageNumberReq.pageSizeLimit)
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
      .toArray();

    try {
      res.send(listById);
    } catch (err) {
      console.log(err);
    }
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
      policy_title:req.body.policy_title,
      added_on: new Date()
    };

    try {
      const putById = await db
        .collection("role")
        .updateOne({ _id: ObjectID(id) }, { $set: role });
      res.json({
        message: "Updates Successfully!"
      });
    } catch (err) {
      return console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

//Deleting by id
exports.deleteById = async (req, res, next) => {
  try {
    let collection = global.db.collection("role");
    let id = req.params.id;

    try {
      const patchById = await collection.updateOne(
        { _id: ObjectID(id) },
        { $set: { deleted: true } }
      );

      res.json({
        message: "Deleted Successfully!"
      });
    } catch (error) {
      return console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
