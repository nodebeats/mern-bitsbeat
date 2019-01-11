// (() => {
//     'use strict';
//     let validationCheck = async (req) => {
//         req
//         .checkBody("blog_category_title", config.messageConfig.validationErrMsg.blog_category_title)
//         .notEmpty();
//         req
//         .checkBody("blog_description", config.messageConfig.validationErrMsg.blog_description)
//         .notEmpty();
        
//         const result = await req.getValidationResult();
//         return result.array();
        
//     };
    
//     //Create Blog-category
//     exports.createBlogCategory = async (req,res,next) => {
//         try {
//             let validation = await validationCheck(req);
//             if (!validation.length > 0) { 
//                 const findBlogCategory = await global.db.collection('blogCategory').findOne({
//                     title_slug :utility.slugifyTitle(req.body.blog_category_title)
//                 });
//                 if(findBlogCategory){
//                     res.status(409).json(config.messageConfig.blogCategory.titleConflict);
//                 }else{
//                     const _id = uuidv4(), 
//                     blog_category_title = req.body.blog_category_title,
//                     title_slug = utility.slugifyTitle(req.body.blog_category_title),
//                     blog_description = req.body.blog_description,
//                     added_on = new Date(),
//                     assignBit = false,
//                     deleted = false;
                    
//                     db.collection("blogCategory")
//                     .insertOne({_id,blog_category_title,title_slug ,blog_description,added_on,deleted,assignBit});
                    
//                     res.json(util.renderApiData(req,res,200,config.messageConfig.blogCategory.blogCreateSuccessfull,
//                         {_id:_id ,blog_category_title:blog_category_title,blog_description:blog_description}));
                        
//                     }
//                 } else {
//                     res.status(400).json({
//                         status_code: "400",
//                         status: "Bad Request",
//                         err: utility.errorMessageControl(validation)
//                     });
//                 }
//             } catch (error) {
//                 next(error)
                
//             }
            
//         }
// })();