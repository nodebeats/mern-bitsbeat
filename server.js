const express = require('express');
const app = express(),
expressValidator = require("express-validator");
// const route = module.exports= express.Router();

const parser = require("body-parser");

const dbConnector = require('./lib/helpers/db.helper'),
    routeHelper = require('./lib/routes/index'),
    logWriter = require('./lib/helpers/logwriter.helper'),
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

//  winstonHelper.init(app);
//console.log('app => ', app.locals.db);
app.get('/', (req, res, next) => {
    console.log('Server is working fine');
    next();
}, function (req, res, next) {
    //  console.log( 'req.dbCon', req.dbCon )
    res.send("Hello Again")
})


//Error middleware
app.use(function (err, req, res, next) {
    errorController.log_error(err, req, res, next);
})


app.listen(8000, () => {
    console.log("Listening to the port on 8000");
});
