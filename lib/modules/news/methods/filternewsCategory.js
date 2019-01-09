(() =>{
    const config = require('./../config');
    const utilityHelper = require('./../../../helpers/utilities.helper');
    const uuid = require('uuid/v4');
    module.exports = async(req,res,next) => {
        try {
           let news_category = req.params.categorySlug;
           const FindCategorySlug = await db.collection("newscategory").findOne({
                title_slug : news_category, deleted: false
            });
            if (FindCategorySlug) {
                const pageNumberRequest = await utilityHelper.paginationControl(req);
                const FindCategoryId = await db.collection("news").find({
                    news_category : FindCategorySlug._id
                },{ projection: {
                    _id: 1,
                    news_title :1,
                    title_slug : 1
                }
            }).sort({
                added_on: -1
            }).skip((pageNumberRequest.pageNumber - 1) * pageNumberRequest.pageSizeLimit)
            .limit(pageNumberRequest.pageSizeLimit)
            .toArray();
            res.status(200).json({
                status:config.messageConfig.news.newsSuccesful,
                data: FindCategoryId
            });
            } else {
                res.status(400).json({
                    status:config.messageConfig.news.newsError,
                    message:"Slug not found"
                });
            }
        }
         catch (err) {
            res.status(500).json({
                status: config.messageConfig.news.newsError,
                msg: 'Please try again. Failed getting the News',
                errMsg: err.toString()
              });
        }
    };
})();