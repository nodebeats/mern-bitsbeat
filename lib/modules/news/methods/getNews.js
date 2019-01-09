(() => {
    'use strict'
    const config = require('./../config');
    const utilityHelper = require('./../../../helpers/utilities.helper');
    const uuid = require('uuid/v4');
    const slugify = require('slugify');
    module.exports = async (req, res) => {
        try {
            const pageNumberRequest = await utilityHelper.paginationControl(req);
            const newsList = await db.collection("news").find({
                    deleted: false
                }, {
                    projection: {
                        _id: 1,
                        news_title: 1,
                        news_category :1,
                        title_slug: 1,
                        news_author: 1,
                        news_description: 1,
                        filePath: 1,
                        added_on: 1,
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
                    // msg: 'Field cannot be left empty',
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
})()