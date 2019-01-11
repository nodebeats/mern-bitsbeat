const express = require("express"),
config = require('./config'),
uuidv4 = require('uuid/v4'),
util = require('./../../commons/util'),
slugify = require('slugify'),
utility = require('./../../helpers/utilities.helper');
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
// exports.createBlogCategory = require('./Method/post');
exports.createBlogCategory = async (req,res,next) => {
    try {
        let validation = await validationCheck(req);
        if (!validation.length > 0) { 
            const findBlogCategory = await global.db.collection('blogCategory').findOne({
                title_slug :utility.slugifyTitle(req.body.blog_category_title)
            });
            
            if(findBlogCategory){
                res.status(409).json(config.messageConfig.blogCategory.titleConflict);
            }else{
                const _id = uuidv4(), 
                blog_category_title = req.body.blog_category_title,
                title_slug = utility.slugifyTitle(req.body.blog_category_title),
                blog_description = req.body.blog_description,
                added_on = new Date(),
                assignBit = false,
                deleted = false;
                
                db.collection("blogCategory")
                .insertOne({_id,blog_category_title,title_slug ,blog_description,added_on,deleted,assignBit});
                
                res.status(200).json(config.messageConfig.blogCategory.blogCreateSuccessfull);
                
                }
            } else {
                res.status(400).json({
                    status_code: "400",
                    status: "Bad Request",
                    err: utility.errorMessageControl(validation)
                });
            }
        } catch (error) {
            next(error)
            
        }
        
    }
    
    //Get BlogCategory
    exports.getBlogCategory = async (req,res,next) => {
        
        try {
            const pageNumberReq = await utility.paginationControl(req);
            const getList = await db.collection("blogCategory")
            .find({deleted:false},
                {
                    projection:{
                        _id: 1,
                        blog_category_title : 1,
                        title_slug: 1,
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
                    res.json(util.renderApiData(req,res,404,config.messageConfig.blogCategory.BlogReadMsg));
                }
            } catch (error) {
                next(error);
            }
        }
        
        //GetById BlogCategory
        exports.getBlogCategoryById = async (req,res,next) => {
            try {
                let uuid = req.params.id;
                const getById = await global.db.collection("blogCategory")
                .findOne({_id:uuid});
                if(getById)
                {
                    res.send(getById);
                }else {
                    res.status(404).json(config.messageConfig.blogCategory.notFound);
                }
            } catch (error) {
                next(error);
            }
        }
        
        
        //Updating by id
        
        exports.UpdateCategoryById = async (req, res, next) => {
            try {
                let validation = await validationCheck(req);
                if (!validation.length > 0) {
                    let id = req.params.id;
                    let blog = {
                        blog_category_title :req.body.blog_category_title,
                        title_slug : utility.slugifyTitle(req.body.blog_category_title),
                        blog_description : req.body.blog_description,
                        added_on: new Date()
                    };
                    const getById = await db.collection("blogCategory")
                    .findOne({_id:id})
                    if(getById) 
                    {
                        const putById = await db.collection("blogCategory")
                        .updateOne({ _id: id},
                            { $set: blog },(err, result) => {
                                if (err) {
                                    res.json(err);
                                }
                                
                                if (result.result.nModified === 1) {
                                    res.status(200)
                                    .json(config.messageConfig.blogCategory.BlogUpdatemsg);
                                } else {
                                    res.status(304).json(config.messageConfig.blogCategory.noChangeMsg)
                                }
                            });
                        }
                        else {
                            res.status(404).json({
                                message : config.messageConfig.blogCategory.notFound
                            });
                        }
                        
                    }else {
                        res.status(400)
                        .json({
                            code: 400,
                            status: 'error',
                            msg:utility.errorMessageControl(validation)
                        })
                    }
                    
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
                            _id:id
                        }
                    )
                    if(blogCategory) 
                    {
                        if(blogCategory.assignBit === false){
                            const patchById = await db.collection('blogCategory').updateOne(
                                { _id: id },
                                { $set: { deleted: true, assignBit:true } }
                            );
                            
                            res.json(util.renderApiData(req,res,200,config.messageConfig.blogCategory.BlogDeleteMsg,
                                {}));
                            } 
                            else {
                                res.json(util.renderApiData(req,res,405,config.messageConfig.blogCategory.cannotDelete,
                                    {}));
                                }
                                
                    }else {
                        res.status(404).json(config.messageConfig.blogCategory.notFound)
                    }
                            
                            
                        } catch (error) {
                            next(error)
                        }
                    };
                    
                    