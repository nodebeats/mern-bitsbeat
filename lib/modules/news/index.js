const express = require('express'),
ObjectID = require('mongodb').ObjectID,
config = require('./config'),
pagination = require('./../../helpers/utilities.helper');

// for photo upload
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })

//ExpressValidator
let validationCheck = async (req) => {
  req.checkBody("news_title", config.messageConfig.validateErrMsg.news_title).notEmpty();
  req.checkBody("news_author", config.messageConfig.validateErrMsg.news_author).notEmpty();
  req.checkBody("news_description", config.messageConfig.validateErrMsg.news_description).notEmpty();
  req.checkBody('email', config.messageConfig.validateErrMsg.email).isEmail();
  
  const result = await req.getValidationResult();
  return result.array();
};  

//Creating News
exports.addNews = async(req, res,next) => {
  try {
    //console.log(req.file);
    var validation = await validationCheck(req);
    //  console.log(validation);
    if (!validation.length > 0) {
      const findNews = await db.collection("news").findOne({
        news_title: req.body.news_title.toUpperCase()
      });
      if (findNews) {
        res.send('Conflit');
        res.status(409).json({
          status: config.messageConfig.news.newsConflict
        });
      } else {
        let news = {
          news_title: req.body.news_title,
          news_author: req.body.news_author,
          news_description: req.body.news_description,
          image_name:req.file.fieldname,
          image_path:req.file.path,
          //choose an image 
          added_on: new Date(),
          deleted: false
        }
        //Setup where the user's file will go
        var storage = multer.diskStorage({
          destination: function(req,file, cb){
            cb(null, '/images/my-uploads')
          },  //A unique name to a file
          filename: function(req, file, cb){
            cb(null, file.fieldname + '-' +Date.now())
          }
        })
        var upload = multer({ storage: storage })
        
        const createPolicy = await db.collection("news").insertOne(news);
        //  const createPolicy = await db.collection("news").insertMany([news,]);
        res.send(config.messageConfig.news.newsSuccesful);
      }
    }else {
      res.status(400).json({
        status_code: "400",
        status: "Bad Request",
        err: pagination.errorMessageControl(validation)
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
};

exports.getNews = async (req, res) => {
  try {
    const pageNumberRequest = await pagination.paginationControl(req);
    const newsList = await db.collection("news").find({
      deleted: false
    }, {
      projection: {
        _id: 1,
        news_title: 1,
        news_author: 1,
        news_description: 1,
        added_on: 1
      }
    }).sort({
      added_on: -1
    })
    .skip((pageNumberRequest.pageNumber - 1) * pageNumberRequest.pageSizeLimit)
    .limit(pageNumberRequest.pageSizeLimit)
    .toArray();
    if (newsList.length > 0) {
      res.json(newsList);
    } else {
      //res.send("Cant get");
      res.status(409).json({
        status: config.messageConfig.news.newsError,
        msg: 'Field cannot be left empty',
        errMsg: err.toString()
      });
    }
  } catch (err) {
    // res.send("Cant get");
    res.send({
      status: config.messageConfig.news.newsError,
      msg: 'Please try again. Failed getting the News',
      errMsg: err.toString()
    });
  }
};

//Reading By id
exports.getNewsById = async (req, res) => {
  try {
    let id = ObjectID(req.params.id);
    const listById = await db.collection("news").findOne({_id: id});
    res.json(listById);
  } catch (err) {
    //console.log('err ', err.stack);
    //  res.send("Cant get Id");
    res.status(409).json({
      status: config.messageConfig.news.newsError,
      msg: 'Please try again. Cannot get News by Id',
      errMsg: err.toString()
    });
  }
};

//Updating by id

exports.updateNewsById = async (req, res, next) => {
  try {
    let id = req.params.id;
    let news = {
      news_title: req.body.news_title,
      news_author: req.body.news_author,
      news_description: req.body.news_description,
      //image
      added_on: new Date(),
      deleted: false
    };
    const putById = await db.collection("news").updateOne({
      _id: ObjectID(id)
    }, {
      $set: news
    });
    //res.send('Sucessfull');
    res.status(200).json(config.messageConfig.news.newsSuccesful);
  } catch (err) {
    // res.send('Error');
    res.status(409).json({
      status: config.messageConfig.news.newsError,
      msg: 'Please try again. Cannot Update by Id',
      errMsg: err.toString()
    });
  }
};

//Patch by id
exports.patchNewsById = async (req, res, next) => {
  try {
    let collection = global.db.collection("news");
    let id = req.params.id;
    const patchById = await collection.updateOne({
      _id: ObjectID(id)
    }, {
      $set: {
        deleted: true
      }
    });
    //res.send('Sucessfull');
    res.send(config.messageConfig.news.newsSuccesful);
  } catch (err) {
    //res.send('Sucessfull');
    res.status(409).json({
      status: config.messageConfig.news.newsError,
      msg: 'Please try again. Cannot Patch at this moment',
      errMsg: err.toString()
    })
  }
};


//Subscription

exports.subscribeCreate = async(req, res) => {
  try {
    let collection = global.db.collection("subscription");
    let create = {
      email: req.body.email,
      added_on: new Date(),
      deleted_on: new Date()
    }
    const createSubscribtion = await collection.insertOne(create);
    res.send(config.messageConfig.subscribe.subscriptionSucess);
    
  } catch (error) {
    res.send(error);
  }
}

exports.subscribeGet = async(req,res) => {
  try {
    let collection = global.db.collection("subscription");
    let read = {
      email: req.body.email,
      added_on: new Date(),
      // deleted_on: new Date()
    }
    console.log(read);
    let sub = await collection.findOne({read});
    console.log(sub);
  } catch (error) {
    res.send(error);
  }
}
