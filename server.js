const express = require('express');
const app = module.exports = express();


const parser = require('body-parser');


// winstonHelper = require('./lib/helpers/log.helper');
// var winston = require('winston');
// require('winston-loggly-bulk'); 

const dbConnector = require('./lib/helpers/db.helper'),
    routeHelper = require('./lib/routes/index'),
    logWriter = require('./lib/helpers/logwriter.helper'),
    redisConnector = require('./lib/helpers/redis.helper');
require('dotenv').config(`${__dirname}/.env`);

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

dbConnector.init(app);
redisConnector.init(app);
routeHelper.init(app);
logWriter.init(app);
//redisCache.init(app);

//  winstonHelper.init(app);
//console.log('app => ', app.locals.db);
// app.get('/', (req, res, next) => {
//     console.log('Server is working fine');
//     next();
// }, function (req, res, next) {
//      console.log( 'req.dbCon', req.dbCon )
//     res.send("Hello Again")
// })




//database connection middleware
// app.use(function (req, res, next) {
//     req.dbCon = app.locals.db;
//     next();
// })

//app.use('/', route);
//app.listen(8000);

app.listen(8000, () => {
    console.log('Listening to the port on 8000');
})
