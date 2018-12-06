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
      policy_title: req.body.policy_title
      });
      if (findPolicy) {
        return res.status(409).json({
          code: 409,
          status: "Conflict",
          message: "This Title is already existed!"
        });
      } else {
        let policy = {
          policy_title: req.body.policy_title,
          policy_route: req.body.policy_route,
          policy_description: req.body.policy_description,
          added_on: new Date(),
          deleted: false
        }
        const createPolicy = await db.collection("policy").insertOne(policy);
        res.json({
          message: "Policies created Successfully!"
        })
      }
    }
    else{
      res.json(validation);
    }
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Registration Failed',
      errMsg: err.toString()
    });

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
      res.json("No User in the list");
    }

  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Failed getting the policies',
      errMsg: err.toString()
    });
  }
};

//Reading By id

exports.getPolicyById = async (req, res, next) => {
  try {
    let id = ObjectID(req.params.id);
    const listById = await db.collection("policy").find(id).toArray();
    res.send(listById);
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Cannot get Policy by Id',
      errMsg: err.toString()
    });
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
    res.json({
      message: "Updates Successfully!"
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Cannot Update by Id',
      errMsg: err.toString()
    });
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
    res.json({
      message: "Deleted Successfully!"
    });
  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Cannot Delete at this moment',
      errMsg: err.toString()
    });
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
    res.send('User deleted sucessfully');

  } catch (err) {
    return res.status(400).json({
      code: 400,
      status: 'Bad request',
      message: 'Please try again. Cannot Delete at this moment',
      errMsg: err.toString()
    });
  }
};