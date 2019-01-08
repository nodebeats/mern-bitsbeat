((logWriter) => {
    'use strict';
    const morgan = require('morgan');
    const fs = require('fs');
    const path = require('path');
    const moment = require('moment-timezone');
    const winston = require('winston');
const accessLogStream = fs.createWriteStream(
   path.join(__dirname,'logs', 'Loggerfile.log'),
      { flags: 'a' }
 );
    logWriter.init = (app) => {
     //   app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
        morgan.token('date', (req, res, tz) => {
            return moment().tz('Asia/Kathmandu').format();
          })
          morgan.format('myformat', '[:date[Asia/kathmandu]] ":method :url" :status :res[content-length] - :response-time ms');
          app.use(morgan('myformat', { stream: accessLogStream }));
          //Winston
        const { createLogger, format, transports } = require('winston');
        const { combine, label, printf } = format;
        const myFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);
        const appendTimestamp = format((info, opts) => {
    if(opts.tz)
        info.timestamp = moment().tz(opts.tz).format();
    return info;
    });
const logger = createLogger({
  level:'info',
  format: combine(
    //winston.format.colorize(),
    label({ label: 'Messages' }),
    appendTimestamp({ tz: 'Asia/Kathmandu' }),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: (__dirname,'logs', 'info.log'), level: 'info' }),
    new winston.transports.File({ filename: (__dirname,'logs', 'error.log'), level: 'error' }),
   // new winston.transports.File({ filename: 'combined.log' })
  ]
},
);
logger.log({
  level: 'info',
  message: 'Hello log files!'
});
logger.log({
  level: 'error',
  message: 'Error Error Error !'
});
    };
   
})(module.exports);