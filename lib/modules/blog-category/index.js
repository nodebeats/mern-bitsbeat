const express = require("express"),
//ObjectID = require("mongodb").ObjectID,
config = require('./config'),
uuidv3 = require('uuid/v3');
paginate = require('./../../helpers/utilities.helper');
let validationCheck = async (req) => {
    req
    .checkBody("blog_category_title", config.messageConfig.validationErrMsg.blog_category_title)
    .notEmpty();
    req
    .checkBody("blog_description", config.messageConfig.validationErrMsg.blog_description)
    .notEmpty();
    
    const result = await req.getValidationResult();
    return result.array();
    
};

//Create Blog-category
exports.createBlogCategory = async (req,res,next) => {
    try {
        let validation = await validationCheck(req);
        if (!validation.length > 0) { 
            const findBlogCategory = await db.collection('blogCategory').findOne({
                blog_category_title : req.body.blog_category_title.toLowerCase()
            });
            if(findBlogCategory){
                res.status(409).json(config.messageConfig.blogCategory.titleConflict);
            }else{
                const blog_category_title = req.body.blog_category_title.toLowerCase(),
                blog_description = req.body.blog_description,
                added_on = new Date(),
                assignBit = false,
                deleted = false;
                
                db.collection("blogCategory")
                .insertOne({blog_category_title,blog_description,added_on,deleted,assignBit});
                
                res.status(200).json(config.messageConfig.blogCategory.blogCreateSuccessfull);
                
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


//Get BlogCategory
exports.getBlogCategory = async (req,res,next) => {
    
    try {
        const pageNumberReq = await paginate.paginationControl(req);
        const getList = await db.collection("blogCategory")
        .find({deleted:false},
            {
                projection:{
                    _id: 1,
                    blog_category_title : 1,
                    blog_description: 1,
                    
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
                .json(config.messageConfig.blogCategory.BlogReadMsg);
            }
        } catch (error) {
            next(error);
        }
    }
    
    //GetById BlogCategory
    exports.getBlogCategoryById = async (req,res,next) => {
        try {
            const uuid = MUUID.from('393967e0-8de1-11e8-9eb6-529269fb1459');
            let id = uuid(req.params.id); 
            const getById = await db.collection("blogCategory")
            .find(id)
            .toArray();
            res.send(getById);
        } catch (error) {
            next(error);
        }
    }
    
    
    //Updating by id
    
    exports.UpdateCategoryById = async (req, res, next) => {
        try {
            let id = req.params.id;
            let blog = {
                blog_category_title :req.body.blog_category_title,
                blog_description : req.body.blog_description,
                added_on: new Date()
            };
            const putById = await db.collection("blogCategory")
            .updateOne({ _id: ObjectID(id) },
            { $set: blog });
            res.status(200)
            .json(config.messageConfig.blogCategory.BlogUpdatemsg);
        } catch (error) {
            next(error);
        }
    };
    
    //Deleting by id
    exports.deleteCategoryById = async (req, res, next) => {
        try {
            let id = req.params.id;
     
            const blogCategory = await db.collection('blogCategory').findOne(
                {   
                 _id:ObjectID(id)
                }
            )
            
            console.log("assignBit",blogCategory.assignBit)
            if(blogCategory.assignBit === false){
                const patchById = await db.collection('blogCategory').updateOne(
                    { _id: ObjectID(id) },
                    { $set: { deleted: true, assignBit:true } }
                );
                console.log("assignBit",blogCategory.assignBit)
                   
                res.status(200)
                .json(config.messageConfig.blogCategory.BlogDeleteMsg);
            } 
            else {
                res.status(405)
                .json(config.messageConfig.blogCategory.cannotDelete);
            }
            
        } catch (error) {
            next(error)
        }
    };
    
    