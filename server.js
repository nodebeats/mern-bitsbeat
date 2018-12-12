const express = require('express');
const app = express(),
expressValidator = require("express-validator"),
nodemailer = require("nodemailer");
//html =require("./index.html");
// const route = module.exports= express.Router();

const parser = require("body-parser");

const dbConnector = require('./lib/helpers/db.helper'),
    routeHelper = require('./lib/routes/index'),
    logWriter = require('./lib/helpers/logwriter.helper'),
    redisConnector = require('./lib/helpers/redis.helper'),
    errorController = require('./lib/modules/errorlogs/index');

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

/*------------------SMTP Sarted-----------------------------*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "Your Gmail ID",
        pass: "Gmail Password"
    }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/index',function(req,res){
    res.sendfile('index.html');
});
app.get('/send',function(req,res){
        rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source</h1>");
}
});




app.listen(8000, () => {
    console.log("Listening to the port on 8000");
});
