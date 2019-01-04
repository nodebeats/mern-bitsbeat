const config = require('./config'),
    utilityHelper = require('./../../helpers/utilities.helper'),
    uuid = require('uuid/v4'),
    slugify = require('slugify');

// Express Validator
let validationCheck = async (req) => {
    req.checkBody("category_title", config.messageConfig.validateErrMsg.category_title).notEmpty();
    req.checkBody("category_description", config.messageConfig.validateErrMsg.category_description).notEmpty();
    req.checkBody("author", config.messageConfig.validateErrMsg.author).notEmpty();
    const result = await req.getValidationResult();
    return result.array();
};

//Creating News
exports.addNewsCategory = async(req, res,next) => {
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
    };
    
    exports.getNewsCategory = async (req, res) => {
            try {
              const pageNumberRequest = await utilityHelper.paginationControl(req);
              const newsList = await db.collection("newscategory").find({
                  deleted: false
                }, {
                  projection: {
                    _id: 1,
                    category_title: 1,
                    category_description: 1,
                    title_slug: 1,
                    author: 1,
                    added_on: 1,
                    updated_on: 1
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
                res.status(409).json({
                  status: config.messageConfig.news.newsError,
                  msg: 'Field cannot be left empty',
                  errMsg: err.toString()
                });
             }
            } catch (err) {
              res.status(400).json({
                status: config.messageConfig.news.newsError,
                msg: 'Please try again. Failed getting the News',
                errMsg: err.toString()
              });
            }
          };
    
    //Reading By id
    exports.getNewsCategoryById = async (req, res) => {
        try {
          let id = req.params.id;
          const listById = await db.collection("newscategory").findOne({_id: id});
          res.json(listById);
        } catch (err) {
            //console.log('err ', err.stack);
          //  res.send("Cant get Id");
          res.status(409).json({
            status: config.messageConfig.news.newsError,
            msg: 'Please try again. Failed getting the News',
            errMsg: err.toString()
          });
        }
    };
    
    
    //Updating by id
    
    exports.updateNewsCategoryById = async (req, res) => {
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
          
          const putById = await db.collection("newscategory").updateOne({
            _id: id
          }, {
            $set: newscategory
          },(err, result) => {
            if (err) {
                res.json(err);
            }
            if (result. result.nModified === 1) {
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
      }
      else {
        res.status(400).json({
          code: 400,
          status: 'error',
          message: utilityHelper.errorMessageControl(validation)
        })
      }
      }catch (err) {
        console.log('Err => ', err.stack)
        res.status(400).json({
            status_code: "400",
            status: "Bad Request",
            message: err
        });
    }
    };
    //Patch by id
    exports.patchNewsCategoryById = async (req, res, next) => {
        try {
          let collection = db.collection("newscategory");
          let id = req.params.id;
          const patchById = await collection.updateOne({
            _id: id
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
    }