((logWriter) => {
    'use strict';
    const morgan = require('morgan');
    const fs = require('fs');
    const path = require('path');
    const moment = require('moment-timezone');
    const winston = require('winston');
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'Loggerfile.log'),
  { flags: 'a' }
);
    logWriter.init = (app) => {
        // app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
        morgan.token('date', (req, res, tz) => {
            return moment().tz('Asia/Taipei').format();
          })
          morgan.format('myformat', '[:date[Asia/Taipei]] ":method :url" :status :res[content-length] - :response-time ms');
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
  level: 'info',
  format: combine(
    label({ label: 'main' }),
    appendTimestamp({ tz: 'Asia/Taipei' }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, 'ap.log'),
      options: { flags: 'a' }
    })
  ]
});
    };
   
})(module.exports);