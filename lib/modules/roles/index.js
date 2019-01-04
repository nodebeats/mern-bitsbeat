const express = require("express"),
ObjectID = require("mongodb").ObjectID,
config = require("./config"),
util = require('./../../commons/util'),
paginate = require("./../../helpers/utilities.helper");

//Check Validations


let validationCheck = async (req) => {
  req
    .checkBody("user_role", config.messageConfig.validationErrMsg.user_role)
    .notEmpty();
  req
  .checkBody("description", config.messageConfig.validationErrMsg.description)
  .notEmpty();
  req
  .checkBody("policy_title",config.messageConfig.validationErrMsg.policy_title)
  .notEmpty();
  
  const result = await req.getValidationResult();
  return result.array();
  
};

//Create of roleRole
exports.addRole = async (req, res, next) => {
  try {
    let validation = await validationCheck(req);
    if (!validation.length > 0) {
      const findRole = await db.collection('role').findOne({
        user_role: req.body.user_role.toLowerCase()
      });
      if(findRole){
          res.status(409).json(config.messageConfig.role.roleConflictMsg);
      }else {

        // const policy_title = await db.collection('policy').findOne({policy_title:req.body.policy_title});
        const user_role = req.body.user_role.toLowerCase(),
          description = req.body.description,
          added_on = new Date(),
          policy_title = req.body.policy_title,
          deleted = false;


          db.collection("role").insertOne({user_role,description,added_on,policy_title});
          res.json(util.renderApiData(req,res,200,config.messageConfig.role.roleCreateSuccess,
          {user_role:user_role,description:description,policy_title:policy_title}));
      }
    } else {
      res.status(400).json({
        status_code: "400",
        status: "Bad Request",
        err: paginate.errorMessageControl(validation)
      });
    }

  } catch (err) {
    next(err)
  }
};

//Reading of roleRole
exports.readRole = async (req, res,next) => {
  try {
    const pageNumberReq = await paginate.paginationControl(req);
    
    const roleList = await db.collection("role").find({ deleted: false },
        {
          projection: {
            _id: 1,
            user_role: 1,
            description: 1,
            policy_title: 1,
            added_on: 1
          }
        })
    .sort({ added_on: -1 })
    .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
    .limit(pageNumberReq.pageSizeLimit)
    .toArray();
    
    if (roleList.length > 0) {
      res.json(roleList);
    } else {
        res.json(util.renderApiData(req,res,404,config.messageConfig.role.roleReadMsg));

      }
    } catch (err) {
      next(err);
    }
  };
  
  //Reading By id
  
  exports.readroleById = async (req, res, next) => {
    try {
      let id = ObjectID(req.params.id);
      const listById = await db.collection("role")
      .find(id)
      .toArray();
    res.send(listById);
  } catch (err) {
    next(err)
  }
};

//Updating by id

exports.UpdateById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let role = {
      user_role: req.body.user_role,
      description: req.body.description,

      added_on: new Date()
    };
    const putById = await db.collection("role").updateOne({ _id: ObjectID(id) }, { $set: role });
    res.json(util.renderApiData(req,res,200,config.messageConfig.role.roleUpdateMsg));
  
  } catch (err) {
    next(err);
  }
};

//Deleting by id
exports.deleteById = async (req, res, next) => {
  try {
    let id = req.params.id;

    const patchById = await db.collection('role').updateOne(
      { _id: ObjectID(id) },
      { $set: { deleted: true } }
    );
    res.json(util.renderApiData(req,res,200,config.messageConfig.role.roleDeleteMsg));

  } catch (err) {
    next(err);
  }
};
