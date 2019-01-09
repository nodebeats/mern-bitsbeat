(() => {
    'use strict';
    const config = require('./../config');
    const utilityHelper = require ('./../../../helpers/utilities.helper');
    const uuid = require('uuid/v4');
    const slugify = require('slugify');

    module.exports = async (req, res) => {
        try {
          let id = req.params.id;
         const listById = await db.collection("newscategory").findOne({_id: id});
         if(listById){
          return res.status(200)
          .json({
            code: 200,
            status: 'success',
            data: listById
          });
         }
         return res.status(404)
      .json({
        code: 404,
        status: 'error',
        message: config.messageConfig.news.newsErrorById.message
      });
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
})();