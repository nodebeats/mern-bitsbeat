const express = require('express'),
ObjectID = require('mongodb').ObjectID,
config = require('./config'),
pagination = require('./../../helpers/utilities.helper');
categoryId = require('./../news_category');


    // for photo upload

    exports.addNews= require('./methods/addNews');
    exports.getNews = require('./methods/getNews');
    exports.getNewsById = require('./methods/getNewsById');
    exports.updateNewsById = require('./methods/updateNewsById');
    exports.patchNewsById = require('./methods/patchNewsById');
    exports.filternewsCategory = require ('./methods/filternewsCategory');