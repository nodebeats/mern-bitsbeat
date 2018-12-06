const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID,
  config = require("./config"),
  paginate = require("./../../helpers/utilities.helper");
 

let validationCheck = async (req) => {
  req
    .checkBody("roleName", config.messageConfig.validationErrMsg.roleName)
    .notEmpty();
  req
    .checkBody("description", config.messageConfig.validationErrMsg.description)
    .notEmpty();
  req
    .checkBody(
      "policy_title",
      config.messageConfig.validationErrMsg.policy_title
    )
    .notEmpty();

  const result = await req.getValidationResult();
  return result.array();
};

//Create of roleRole
exports.addRole = async (req, res, next) => {
  try {
    let validation = await validationCheck(req);
    if (!validation.length > 0) {
      const collection = db.collection("role");

      const roleName = req.body.roleName,
        description = req.body.description,
        added_on = new Date(),
        deleted = false;

       db.collection("role").insertOne({roleName,description,added_on,deleted});
        res.send(config.messageConfig.user.userCreateSuccess);
    
    }else{
      res.json(validation);
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
        {
          projection: {
            _id: 1,
            roleName: 1,
            description: 1,
            policy_title: 1,
            added_on: 1
          }
        }
      )
      .sort({ added_on: -1 })
      .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
      .limit(pageNumberReq.pageSizeLimit)
      .toArray();

    if (roleList.length > 0) {
      res.json(roleList);
    } else {
      res.send(config.messageConfig.user.userReadMsg);
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
    res.send(listById);
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
      .updateOne({ _id: ObjectID(id) }, { $set: role });
      res.send(config.messageConfig.user.userUpdateMsg);
  } catch (err) {
    console.log(err);
  }
};

//Deleting by id
exports.deleteById = async (req, res, next) => {
  try {
    let collection = global.db.collection("role");
    let id = req.params.id;

    const patchById = await collection.updateOne(
      { _id: ObjectID(id) },
      { $set: { deleted: true } }
    );
    res.send(config.messageConfig.user.userDeleteMsg);
  } catch (err) {
    console.log(err);
  }
};