const express = require('express');
require('dotenv').config(`${__dirname}/.env`);
const session = require('express-session');
const config = require('./lib/configs/app.config');
const app = express(),
    expressValidator = require("express-validator"),
    cors = require('cors');
const passport = require('passport');
const parser = require("body-parser");

//html =require("./index.html");
// const route = module.exports= express.Router();

app.use(cors());

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
//Express session use resave-> to store the object in Session Store

const dbConnector = require('./lib/helpers/db.helper'),
    routeHelper = require('./lib/routes/index'),
    logWriter = require('./lib/helpers/logwriter.helper'),
    redisConnector = require('./lib/helpers/redis.helper'),
    path = require('path'),
    errorController = require('./lib/modules/errorlogs/index');


// app.use(async (req, res, next) => {
//     console.log('============================================================')
//    await 
//    console.log('global.db', global.db);
// });
dbConnector.init(app);
redisConnector.init(app);
app.use(session({
    secret: config.secretKey,
    resave: true 
}));
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    expressValidator({
        errorFormatter: function (param, msg, value) {
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

//  winstonHelper.init(app);
//console.log('app => ', app.locals.db);
app.get('/', (req, res, next) => {
    console.log('Server is working fine');
    next();
}, function (req, res, next) {
    //  console.log( 'req.dbCon', req.dbCon )
    res.send("Hello Again")
})

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

//Error middleware
app.use(function (err, req, res, next) {
    errorController.log_error(err, req, res, next);
})


app.listen(8000, () => {
    console.log("Listening to the port on 8000");
});
