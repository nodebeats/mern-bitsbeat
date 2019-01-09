(() => {
  'use strict';

  const config = require('./../config');
  const utilityHelper = require ('./../../../helpers/utilities.helper');
  const uuid = require('uuid/v4');
  const slugify = require('slugify');

  // Express Validator
let validationCheck = async (req) => {
  req.checkBody("category_title", config.messageConfig.validateErrMsg.category_title).notEmpty();
  req.checkBody("category_description", config.messageConfig.validateErrMsg.category_description).notEmpty();
  req.checkBody("author", config.messageConfig.validateErrMsg.author).notEmpty();
  const result = await req.getValidationResult();
  return result.array();
};

module.exports = async(req, res,next) => {
    try {
          var validation = await validationCheck(req);
        if (!validation.length > 0) {
          const existingNewsCategory = await db.collection("newscategory").findOne({
            title_slug: utilityHelper.slugifyTitle(req.body.category_title),
          });
          console.log("Hello", existingNewsCategory);
          if (existingNewsCategory) {
            res.status(409).json(config.messageConfig.news.newsConflict);
          } else {
            let newscategory = {
              _id : uuid(),
              category_title:req.body.category_title,
              title_slug: utilityHelper.slugifyTitle(req.body.category_title),
              category_description: req.body.category_description,
              author: req.body.author,
              added_on: new Date(),
              deleted: false
            }
             //Setup where the user's file will go
            const createNewsCategory = await db.collection("newscategory").insertOne(newscategory);
            //  const createPolicy = await db.collection("news").insertMany([news,]);
            res.send(config.messageConfig.news.newsSuccesful);
          }
        }else {
          res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            err: utilityHelper.errorMessageControl(validation)
          });
        }
      }catch (err) {
        // res.send("Please try again");
        res.status(409).json({
          status: config.messageConfig.news.newsError,
          msg: 'Please try again. Registration Failed',
          errMsg: err.toString()
        });
      }
      next();
    };
})();

    