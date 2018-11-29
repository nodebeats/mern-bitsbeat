
//export wala lekha hai 
((winstonHelper) => {
    var express = require('express');
    var expressWinston = require('express-winston');
    var winston = require('winston');
    require('winston-loggly-bulk');

    // const options = {
    //   inputToken: process.env.LOGGLY_TOKEN,
    //   subdomain: process.env.LOGGLY_ORG,
    // };
    // winston.add(winston.transports.Loggly);  

    winstonHelper.init= (app) => {
        var logger = new winston.Logger({
            transports: [
                // new winston.transports.Loggly({
                //     subdomain: 'SUBDOMAIN',
                //     inputToken: 'TOKEN',
                //     json: true,
                //     tags: ["Winston-Morgan"]
                // }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    json: false,
                    colorize: true
                })
            ],
            exitOnError: false
        }),
        
            loggerstream = {
                write: function (message, encoding) {
                    logger.info(message);
                }
            };
        
        app.use(require("morgan")("combined", { "stream": loggerstream }));
        
    };

})(module.exports);



// const level = process.env.LOG_LEVEL || 'debug';

//  morgan(':method :url :status :response-time ms - :res[content-length]');
// const logger = new winston.Logger({
//     transport:[
//         new winston.transports.Console({
//             level: level,
//             timestamp:function(){
//                 return(new Date().toISOString());
//             }
//         })
//     ]
// });

// module.exports = logger

   //var loggerFormat = ':method : url" :status: responsetime ms';