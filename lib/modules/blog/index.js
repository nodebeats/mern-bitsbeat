const express = require("express"),
ObjectID = require("mongodb").ObjectID,
UUID = require('uuid-js');
config = require('./config'),
paginate = require('./../../helpers/utilities.helper');


let validationCheck = async (req) => {
    req
    .checkBody("title", config.messageConfig.validationErrMsg.title)
    .notEmpty();
    req
    .checkBody("description", config.messageConfig.validationErrMsg.description)
    .notEmpty();
    req
    .checkBody("tags",config.messageConfig.validationErrMsg.tags)
    .notEmpty();
    req
    .checkBody("author",config.messageConfig.validationErrMsg.author)
    .notEmpty();
    // req
    // .checkBody("banner",config.messageConfig.validationErrMsg.banner)
    // .notEmpty();
    
    const result = await req.getValidationResult();
    return result.array();
    
};

//Create Blog
exports.createBlog = async (req,res,next) => {
    try {
        let validation = await validationCheck(req);
        if (!validation.length > 0) { 
            const findBlog = await db.collection('Blog').findOne({
                title : req.body.title.toLowerCase()
            });
            if(findBlog){
                res.status(409).json(config.messageConfig.blog.titleConflict);
            }else{
                const title = req.body.title.toLowerCase(),
                description = req.body.description,
                tags = req.body.tags,
                author = req.body.author,
                added_on = new Date(),
                deleted = false;
                
                db.collection("Blog").insertOne({title,description,tags,author,added_on,deleted});
                res.status(200).json(config.messageConfig.blog.blogCreateSuccessfull);
                
            }
            
        } else {
            res.status(400).json({
                status_code: "400",
                status: "Bad Request",
                err: paginate.errorMessageControl(validation)
            });
        }
    } catch (error) {
        next(error)
        
    }
}

//Get Blog
exports.getBlog = async (req,res,next) => {
    
    try {
        const pageNumberReq = await paginate.paginationControl(req);
        const getList = await db.collection("Blog")
        .find({deleted:false},
            {
                projection:{
                    _id: 1,
                    title : 1,
                    description: 1,
                    tags: 1,
                    author:1,
                    added_on: 1,
                    deleted :1
                }
            })
            .sort({added_on: -1})
            .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
            .limit(pageNumberReq.pageSizeLimit)
            .toArray();
            
            if(getList.length > 0) {
                res.json(getList);
            }else {
                res.status(404)
                .json(config.messageConfig.blog.BlogReadMsg);
            }
        } catch (error) {
            next(error);
        }
    }
    
    
    //GetById Blog
    exports.getBlogById = async (req,res,next) => {
        try {
            var uuid4 = UUID.create();
            console.log(uuid4.toString());
            let id = ObjectID(req.params.id);
            const getById = await db.collection("Blog")
            .find(id)
            .toArray();
            res.send(getById);
        } catch (error) {
            next(error);
        }
    }
    
    
    //Updating by id
    
    exports.UpdateById = async (req, res, next) => {
        try {
            let id = req.params.id;
            let blog = {
                title: req.body.title,
                description: req.body.description,
                tags: req.body.tags,
                author: req.body.author,
                added_on: new Date()
            };
            const putById = await db.collection("Blog")
            .updateOne({ _id: ObjectID(id) },
            { $set: blog });
            res.status(200)
            .json(config.messageConfig.blog.BlogUpdatemsg);
        } catch (error) {
            next(error);
        }
    };
    
    //Deleting by id
    exports.deleteById = async (req, res, next) => {
        try {
            let id = req.params.id;
            
            const patchById = await db.collection('Blog').updateOne(
                { _id: ObjectID(id) },
                { $set: { deleted: true } }
            );
            
            res.status(200)
            .json(config.messageConfig.blog.BlogDeleteMsg);
        } catch (error) {
            next(error)
        }
    };
    