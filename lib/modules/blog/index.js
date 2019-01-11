const express = require("express"),
uuidv4 = require('uuid/v4'),
config = require('./config'),
multer  = require('multer'),
upload = multer({ dest: 'uploads/' }),
path = require('path'),
slugify = require('slugify'),
paginate = require('./../../helpers/utilities.helper');


let validationCheck = async (req) => {
    req
    .checkBody("Blog_title", config.messageConfig.validationErrMsg.title)
    .notEmpty();
    req
    .checkBody("Blog_description", config.messageConfig.validationErrMsg.description)
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
// exports.createBlog = require('./Method/post');
exports.createBlog = async (req,res,next) => {
    try {
        
        let validation = await validationCheck(req);
        if (!validation.length > 0) { 
            const findBlog = await db.collection('Blog').findOne({
                title_slug:paginate.slugifyTitle(req.body.Blog_title)
            });
            if(findBlog){
                res.status(409).json(config.messageConfig.blog.titleConflict);
            }else{
                const _id = uuidv4(),
                Blog_title = req.body.Blog_title,
                title_slug = paginate.slugifyTitle(req.body.Blog_title),
                blog_category = req.body.blog_category,
                Blog_description = req.body.Blog_description,
                tags = req.body.tags,
                author = req.body.author,
                filePath = req.file.path,
                added_on = new Date(),
                deleted = false;
                
                const createBlog = await db.collection("Blog")
                .insertOne({_id,Blog_title,title_slug,blog_category,Blog_description,tags,author,filePath,added_on,deleted});
                res.json(config.messageConfig.blog.blogCreateSuccessfull);
                
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
                    Blog_title : 1,
                    title_slug: 1,
                    blog_category:1,
                    Blog_description: 1,
                    tags: 1,
                    author:1,
                    filePath: 1,
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
            let id = req.params.id;
            const getById = await db.collection("Blog")
            .findOne({_id:id});
            if(getById)
            {
                res.send(getById);
            }else{
                res.status(404).json(config.messageConfig.blog.notFound);
            }
            
        } catch (error) {
            next(error);
        }
    }
    
    
    //Updating by id
    
    exports.UpdateById = async (req, res, next) => {
        try {
            let validation = await validationCheck(req);
            if (!validation.length > 0) {
                let id = req.params.id;
                let blog = {
                    Blog_title: req.body.Blog_title,
                    Blog_description: req.body.Blog_description,
                    title_slug: paginate.slugifyTitle(req.body.Blog_title),
                    tags: req.body.tags,
                    author: req.body.author,
                    added_on: new Date()
                };
                const listById = await db.collection("Blog").findOne({_id: id});
                if (listById){
                    if (req.file) {
                        const image = req.file.myfile;
                        blog.image = image;
                        blog.image_path = req.file.path;
                    }
                    
                    const putById = await db.collection("Blog")
                    .updateOne({ _id: id },
                        { $set: blog },(err, result) => {
                            if (err) {
                                res.json(err);
                            };
                            //  res.status(200)
                            //  .json(config.messageConfig.blog.BlogUpdatemsg);
                            if (result.result.nModified === 1) {
                                res.status(200)
                                .json(config.messageConfig.blog.BlogUpdatemsg);
                            } else {
                                res.status(304).json(config.messageConfig.blog.noChangeMsg)
                            }
                        });
                    }else {
                        res.status(404).json(config.messageConfig.blog.notFound);
                    }
                        
                    }else {
                        res.status(400)
                        .json({
                            code: 400,
                            status: 'error',
                            msg: paginate.errorMessageControl(validation)
                        })
                    }
                } catch (error) {
                    next(error);
                }
            };
            
            //Deleting by id
            exports.deleteById = async (req, res, next) => {
                try {
                    let id = req.params.id;
                    
                    const patchById = await db.collection('Blog').updateOne(
                        { _id: id },
                        { $set: { deleted: true } }
                    );
                    if(patchById)
                    {
                        res.status(200)
                        .json(config.messageConfig.blog.BlogDeleteMsg);
                    }else{
                        res.status(404).json(config.messageConfig.blog.notFound);

                    }    
                   
                } catch (error) {
                    next(error)
                }
            };

//Filter by TitleSlug
exports.filterByCategoryTitle = async (req,res,next) => {
    try {
        let blog_category = req.params.categorySlug;
        const findCategorySlug = await global.db.collection('blogCategory')
        .findOne({
            title_slug : blog_category, deleted:false
        });
        if(findCategorySlug){
            const pageNumberReq = await paginate.paginationControl(req);
            const FindCategoryId = await db.collection("Blog")
            .find({
                blog_category : findCategorySlug._id
            },
                {
                    projection:{
                        _id: 1,
                        Blog_title : 1,
                        title_slug: 1,
                        added_on: 1
                    }
                })
                .sort({added_on: -1})
                .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
                .limit(pageNumberReq.pageSizeLimit)
                .toArray(); 
                
                res.status(200).json({
                    status:config.messageConfig.blog.slugFilter,
                    data: FindCategoryId 
                });
             }else{
                 res.status(400).json(config.messageConfig.blog.notFound);
             }
    } catch (error) {
        next(error);
    }

}

// //filter by tags
// exports.filterTags = async (req,res,next) => {

//    try {
//        let tagFilter = req.params.tags;
//        const findCategorySlug = await global.db.collection('blog')
//        .findOne({
//            tags : tagFilter, deleted:false      
//          });
//         console.log("tag",tagFilter);
//        console.log("slug",findCategorySlug);
       
//        if(findCategorySlug){
//         const pageNumberReq = await paginate.paginationControl(req);
//         const FindCategoryId = await global.db.collection("blog")
//         .find({
//             tagFilter : findCategorySlug._id
//         },
//             {
//                 projection:{
//                     _id: 1,
//                     Blog_title : 1,
//                     title_slug: 1,
//                     tags:1,
//                     added_on: 1
//                 }
//             })
//             .sort({added_on: -1})
//             .skip((pageNumberReq.pageNumber - 1) * pageNumberReq.pageSizeLimit)
//             .limit(pageNumberReq.pageSizeLimit)
//             .toArray(); 
            
//             res.status(200).json({
//                 status:config.messageConfig.blog.tagFilter,
//                 data: FindCategoryId 
//             });
//          }else{
//              res.status(400).json(config.messageConfig.blog.notFound);
//          }
//    } catch (error) {
//        next(error)
//    }
// }


// //filter by category title
// exports.filterByTitle = async (req,res,next) => {
//     try {
        

//     } catch (error) {
//         next(error);
//     }
// }
