<<<<<<< HEAD
const express = require("express");
const app = express();
=======
const express = require('express');
const app = express(),
expressValidator = require("express-validator");
>>>>>>> authorization
// const route = module.exports= express.Router();

const parser = require("body-parser");

const dbConnector = require('./lib/helpers/db.helper'),
    routeHelper = require('./lib/routes/index'),
    logWriter = require('./lib/helpers/logwriter.helper'),
<<<<<<< HEAD
    expressValidator = require('express-validator');
redisConnector = require('./lib/helpers/redis.helper');
require('dotenv').config(`${__dirname}/.env`);

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

dbConnector.init(app);
redisConnector.init(app);

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


routeHelper.init(app);
logWriter.init(app);
//redisCache.init(app);
=======
    redisConnector = require('./lib/helpers/redis.helper');
    require('dotenv').config(`${__dirname}/.env`);

    app.use(parser.urlencoded({ extended: false}));
    app.use(parser.json());
    dbConnector.init(app);
    redisConnector.init(app);

    app.use(
        expressValidator({errorFormatter: function(param, msg, value) {
            var namespace = param.split("."),
              root = namespace.shift(),
              formParam = root;
      
            while (namespace.length) {
              formParam += "[" + namespace.shift() + "]";
            }
            return {
              param: formParam,
              msg: msg,
              value: value
            };
          }
        })
      );
     
     routeHelper.init(app);
    logWriter.init(app);
    //redisCache.init(app);
>>>>>>> f564c9f0fd3e6b49188e1566529a9e6f4f000ded

//  winstonHelper.init(app);
//console.log('app => ', app.locals.db);
 app.get('/', (req, res, next) => {
    console.log('Server is working fine');
    next();
}, function(req, res, next){
  //  console.log( 'req.dbCon', req.dbCon )
    res.send("Hello Again")
} )

//Morgan and Winston

//database connection middleware
// app.use(function(req, res, next){
//     console.log('Here-----------------');
//     if (app.locals.db) {
//         console.log('Here===================');
//         req.dbCon = app.locals.db;
//     }
//     next();
// })

app.listen(8000, () => {
  console.log("Listening to the port on 8000");
});
