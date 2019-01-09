(() =>{
'use strict'
const config = require('./../config');
const utilityHelper = require ('./../../../helpers/utilities.helper');
const uuid = require('uuid/v4');
const slugify = require('slugify');

module.exports = async (req, res, next) => {
    try {
      let collection = db.collection("newscategory");
      let id = req.params.id;
      const listById = await db.collection("newscategory").findOne({_id: id});
      if (listById) {
        const patchById = await collection.updateOne({
          _id: id
        }, {
          $set: {
            deleted: true
          }
        });
        //res.send('Sucessfull');
        res.status(200).json({
          status: config.messageConfig.news.newsSuccesful,
          message: "Successfully Deleted"
        });
      } else {
        res.status(409).json({
          status : config.messageConfig.news.newsErrorById
          //errMsg: err.toString()
        });
      }

    } catch (err) {
        //res.send('Sucessfull');
      res.status(409).json({
        status: config.messageConfig.news.newsError,
        msg: 'Please try again. Cannot Patch at this moment',
        errMsg: err.toString()
      })
    }
}
})()