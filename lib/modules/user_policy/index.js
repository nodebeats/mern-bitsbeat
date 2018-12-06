const express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  ObjectID = require("mongodb").ObjectID,
  pagination = require('./../../helpers/utility.helper'),
  config = require('./config');

//ExpressValidator
let validationCheck = async (req) => {
  req.checkBody("policy_title", config.messageConfig.validateErrMsg.policy_title).notEmpty();
  req.checkBody("policy_route", config.messageConfig.validateErrMsg.policy_route).notEmpty();
  req.checkBody("policy_description", config.messageConfig.validateErrMsg.policy_description).notEmpty();
  const result = await req.getValidationResult();
  return result.array();
};

//Create of roleRole
exports.addPolicy = async (req, res, next) => {
  try {
    
    var validation = await validationCheck(req);
  //  console.log(validation);
    if (!validation.length > 0) {
      const findPolicy = await db.collection("policy").findOne({
      policy_title: req.body.policy_title.toLowerCase()
      });
      if (findPolicy) {
        res.send(config.messageConfig.policy.policyConflict); 
      } else {
        let policy = {
          policy_title: req.body.policy_title.toLowerCase(),
          policy_route: req.body.policy_route,
          policy_description: req.body.policy_description,
          added_on: new Date(),
          deleted: false
        }
        const createPolicy = await db.collection("policy").insertOne(policy);
        res.send(config.messageConfig.policy.policySuccesful);
      }
    }
    else{
      res.json(validation);
    }
  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg: 'Please try again. Registration Failed',
      errMsg: err.toString() });
  }
};

//Reading of roleRole
exports.getPolicy = async (req, res) => {
  try {
    const pageNumberRequest = await pagination.paginationControl(req);
    const policyList = await db.collection("policy").find({
        deleted: false
      }, {
        projection: {
          _id: 1,
          policy_title: 1,
          policy_route: 1,
          policy_description: 1,
          added_on: 1
        }
      }).sort({
        added_on: -1
      })
      .skip((pageNumberRequest.pageNumber - 1) * pageNumberRequest.pageSizeLimit)
      .limit(pageNumberRequest.pageSizeLimit)
      .toArray();
    if (policyList.length > 0) {
      res.json(policyList);
    } else {
      res.send({status: config.messageConfig.policy.policyError, 
        msg: 'Filed cannot be left empty',
        errMsg: err.toString() });
    }

  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg: 'Please try again. Failed getting the policies',
      errMsg: err.toString() });
  }
};

//Reading By id

exports.getPolicyById = async (req, res, next) => {
  try {
    let id = ObjectID(req.params.id);
    const listById = await db.collection("policy").find(id).toArray();
    res.send(listById);
  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg: 'Please try again. Cannot get Policy by Id',
      errMsg: err.toString() });
  }
};

//Updating by id

exports.updateById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let policy = {
      policy_title: req.body.policy_title,
      policy_route: req.body.policy_route,
      policy_description: req.body.policy_description,
      added_on: new Date(),
      deleted: false
    };
    const putById = await db.collection("policy").updateOne({
      _id: ObjectID(id)
    }, {
      $set: policy
    });
    res.send(config.messageConfig.policy.policySuccesful);
  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg: 'Please try again. Cannot Update by Id',
      errMsg: err.toString() });
  }
};

//Patch by id
exports.patchById = async (req, res, next) => {
  try {
    let collection = global.db.collection("policy");
    let id = req.params.id;
    const patchById = await collection.updateOne({
      _id: ObjectID(id)
    }, {
      $set: {
        deleted: true
      }
    });
    res.send(config.messageConfig.policy.policySuccesful);
  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg:'Please try again. Cannot Patch at this moment',
      errMsg: err.toString() })
  }
};
//Delete compeletly by Id
exports.deleteById = (req, res, next) => {
  try {
    let id = req.params.id;
    let policy = {
      policy_title: req.body.policy_title,
      policy_route: req.body.policy_route,
      policy_description: req.body.policy_description,
      added_on: new Date()

    };

    db.collection("policy").remove({
      _id: ObjectID(id)
    })
    res.send(config.messageConfig.policy.policySuccesful);


  } catch (err) {
    res.send({status: config.messageConfig.policy.policyError, 
      msg:'Please try again. Cannot Delete at this moment',
      errMsg: err.toString() })
  }
};