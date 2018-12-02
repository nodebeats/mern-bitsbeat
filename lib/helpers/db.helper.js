((dbConnector) => {
    'use strict';
    const MongoClient = require('mongodb').MongoClient;
    const dbconfig = require('../configs/app.config');

    dbConnector.init = async(app) =>{
      //  console.log(dbconfig);
       // console.log(`mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}:`);
        MongoClient.connect(`mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}/${dbconfig.db}`,{useNewUrlParser: true }).then((client) => {
            //MongoClient.connect(dbconfig.url,{useNewUrlParser: true }).then((client) => {
            const db =client.db(`mernCMS`);
           
        //    app.locals.db = db;
        global.db = db;
        //    console.log('connection success....', app.locals.db);
       }).catch((err) => {
           console.log('Database connection denied');
       });

    }
})(module.exports)