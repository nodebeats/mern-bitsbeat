(() => {
  'use strict'
  const config = require('./../config');
  const utilityHelper = require('./../../../helpers/utilities.helper');
  const uuid = require('uuid/v4');
  const slugify = require('slugify');
  //const category = require('./../../news_category/methods/addCategory')

  let validationCheck = async (req) => {
    req.checkBody("news_title", config.messageConfig.validateErrMsg.news_title).notEmpty();
    req.checkBody("news_author", config.messageConfig.validateErrMsg.news_author).notEmpty();
    req.checkBody("news_description", config.messageConfig.validateErrMsg.news_description).notEmpty();
    const result = await req.getValidationResult();
    return result.array();
  };
  //Creating News
  module.exports = async (req, res, next) => {
    try {
      var validation = await validationCheck(req);
      if (!validation.length > 0) {
        const findNews = await db.collection("news").findOne({
          title_slug: utilityHelper.slugifyTitle(req.body.news_title)
        });
        if (findNews) {
          res.status(409).json({
            status: config.messageConfig.news.newsConflict
          });
        } else {
          let news = {
            _id : uuid(),
            news_title: req.body.news_title,
            news_category : req.body.news_category,
            title_slug: utilityHelper.slugifyTitle(req.body.news_title),
            //category_slug:req.body.news_category.category_slug,
            news_author: req.body.news_author,
            news_description: req.body.news_description,
            filePath: req.file.path,
            //choose an image 
            added_on: new Date(),
            deleted: false
          }
          //Setup where the user's file will go
          const createPolicy = await db.collection("news").insertOne(news);
          //  const createPolicy = await db.collection("news").insertMany([news,]);
          res.send(config.messageConfig.news.newsSuccesful);
        }
      } else {
        res.status(400).json({
          status_code: "400",
          status: "Bad Request",
          err: utilityHelper.errorMessageControl(validation)
        });
      }
    } catch (err) {
      // res.send("Please try again");
      res.status(409).json({
        status: config.messageConfig.news.newsError,
        msg: 'Please try again. Registration Failed',
        errMsg: err.toString()
      });
    }
  };
})()