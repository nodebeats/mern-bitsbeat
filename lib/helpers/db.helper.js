((dbConnector) => {
    'use strict';
    const MongoClient = require('mongodb').MongoClient;
    const dbconfig = require('../configs/app.config');

    dbConnector.init = async(app) =>{
        let options = {useNewUrlParser: true };
        // const dbConnection = await MongoClient.connect(dbconfig.url,options);
        // app.locals.db = dbConnection;
        // console.log('database connection success....')

        MongoClient.connect(dbconfig.url,options).then((client) => {

            const db =client.db('mernCMS');

           global.db = db;
           console.log('connection success....', global.db);
       });

    }
})(module.exports)