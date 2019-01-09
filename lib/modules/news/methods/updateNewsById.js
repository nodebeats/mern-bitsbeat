(()=>{
'use strict'
const config = require('./../config');
const utilityHelper = require ('./../../../helpers/utilities.helper');
const uuid = require('uuid/v4');
const slugify = require('slugify');

let validationCheck = async (req) => {
  req.checkBody("news_title", config.messageConfig.validateErrMsg.news_title).notEmpty();
  req.checkBody("news_description", config.messageConfig.validateErrMsg.news_description).notEmpty();
  req.checkBody("news_author", config.messageConfig.validateErrMsg.news_author).notEmpty();
  req.checkBody("news_category", config.messageConfig.validateErrMsg.news_category).notEmpty();
  const result = await req.getValidationResult();
  return result.array();
};

module.exports = async (req, res) => {
    try {
      let validation = await validationCheck(req);
     // console.log('Hello Hello')
      if (!validation.length > 0) {
        let id = req.params.id;
          let news = {
            news_title: req.body.news_title,
            news_category:req.body.news_category,
            title_slug: utilityHelper.slugifyTitle(req.body.news_title),
            news_author: req.body.news_author,
            news_description: req.body.news_description,
            updated_on: new Date()
          };
          const listById = await db.collection("news").findOne({_id: id});
          if (listById){ 
          if (req.file) {
            const image = req.file.myfile;
            news.image = image;
            news.image_path = req.file.path;
        }
          const putById = await db.collection("news").updateOne({
            _id: id
          }, {
            $set: news
          },(err, result) => {
            if (err) {
              return res.json({
                messgae: "error",
                errMsg:err.toString()
              });
            }
            if (result.result.nModified === 1) {
              res.status(200).json({
                  message: config.messageConfig.news.newsSuccesful
                  // configMessage.messageConfig.news.newsSuccesful
              });
          } else {
              res.status(304).json({
                  status_code: "200",
                  status: "OK",
                  message: "No changes made"
              })
          }
        });
        } else {
          res.status(400).json({
            status : config.messageConfig.news.newsErrorById
          });
        }
    }
    else {
      res.status(400)
      .json({
        code: 400,
        status: 'error',
        msg: utilityHelper.errorMessageControl(validation)
      })
    }
    }catch (err) {
      res.status(400).json({
          status_code: "400",
          status: "Bad Request",
          errMsg:err.toString()
      });
  }
  };
})()