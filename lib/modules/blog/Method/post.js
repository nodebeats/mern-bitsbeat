// (() => {
//     'use strict';
//     let validationCheck = async (req) => {
//         req
//         .checkBody("Blog_title", config.messageConfig.validationErrMsg.title)
//         .notEmpty();
//         req
//         .checkBody("Blog_description", config.messageConfig.validationErrMsg.description)
//         .notEmpty();
//         req
//         .checkBody("tags",config.messageConfig.validationErrMsg.tags)
//         .notEmpty();
//         req
//         .checkBody("author",config.messageConfig.validationErrMsg.author)
//         .notEmpty();
//         // req
//         // .checkBody("banner",config.messageConfig.validationErrMsg.banner)
//         // .notEmpty();
        
//         const result = await req.getValidationResult();
//         return result.array();
        
//     };
    
//     //Create Blog
//     exports.createBlog = async (req,res,next) => {
//         try {
//             let blogData = await global.db.collection('blogCategory').findOne({_id:data._id});
    
//             let blogCollect = await global.db.collection('blogCategory').aggregate([
//                 {
//                     $match: { '_id': data._id, 'blog_category_title': { $in: blogData.blog_category_title} }
    
//                 }
    
//             ])
    
//             let validation = await validationCheck(req);
//             if (!validation.length > 0) { 
//                 const findBlog = await db.collection('Blog').findOne({
//                     title_slug:paginate.slugifyTitle(req.body.Blog_title)
//                 });
//                 if(findBlog){
//                     res.status(409).json(config.messageConfig.blog.titleConflict);
//                 }else{
//                     const _id = uuidv4(),
//                     Blog_title = req.body.Blog_title,
//                     title_slug = paginate.slugifyTitle(req.body.Blog_title),
//                     Blog_description = req.body.description,
//                     tags = req.body.tags,
//                     author = req.body.author,
//                     filePath = req.file.path,
//                     added_on = new Date(),
//                     deleted = false;
                    
//                     const createBlog = await db.collection("Blog")
//                     .insertOne({_id,Blog_title,title_slug,Blog_description,tags,author,filePath,added_on,deleted});
//                     res.json(config.messageConfig.blog.blogCreateSuccessfull);
                    
//                 }
                
//             } else {
//                 res.status(400).json({
//                     status_code: "400",
//                     status: "Bad Request",
//                     err: paginate.errorMessageControl(validation)
//                 });
//             }
//         } catch (error) {
//             next(error)
            
//         }
//     }
    
// })();