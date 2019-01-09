(() => {
'use strict'
const config = require('./../config');
const utilityHelper = require ('./../../../helpers/utilities.helper');
const uuid = require('uuid/v4');
const slugify = require('slugify');

let validationCheck = async (req) => {
  req.checkBody("category_title", config.messageConfig.validateErrMsg.category_title).notEmpty();
  req.checkBody("category_description", config.messageConfig.validateErrMsg.category_description).notEmpty();
  req.checkBody("author", config.messageConfig.validateErrMsg.author).notEmpty();
  const result = await req.getValidationResult();
  return result.array();
};
module.exports= async (req, res) => {
    try {
      let validation = await validationCheck(req);
      if (!validation.length > 0) {
        let id = req.params.id;
          let newscategory = {
            category_title: req.body.category_title,
            title_slug: utilityHelper.slugifyTitle(req.body.category_title),
            category_description: req.body.category_description,
            author: req.body.author,
            updated_on: new Date()
          };
          const listById = await db.collection("newscategory").findOne({_id: id});
          if (listById){ 
          const putById = await db.collection("newscategory").updateOne({
            _id: id
          }, {
            $set: newscategory
          },(err, result) => {
            if (err) {
               return res.json({
                 messgae: "error",
                 errMsg:err.toString()
               });
            }
            if (result. result.nModified === 1) {
              res.status(200).json({
                  message: config.messageConfig.news.newsSuccesful
                  // configMessage.messageConfig.news.newsSuccesful
              });
            } 
            else {
              res.status(304).json({
                  status: "OK",
                  message: "No changes made. Please make some changes"
              });
          }
        });
        } 
        else {
          res.status(409).json({
            status : config.messageConfig.news.newsErrorById,
          });
        }
    }
    else {
      res.status(400).json({
        code: 400,
        status: 'error',
        message: utilityHelper.errorMessageControl(validation)
      })
    }
    }catch (err) {
      res.status(400).json({
          status_code: "400",
          status: "Cannot find the ID",
          message: err
      });
  }
  };
})()