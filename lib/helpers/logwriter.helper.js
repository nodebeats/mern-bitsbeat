((logWriter) => {
    'use strict';
    const morgan = require('morgan');
    logWriter.init = (app) => {
    app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
    };
   
})(module.exports);