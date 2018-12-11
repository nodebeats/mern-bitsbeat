((dbConnector) => {
    'use strict';
    const MongoClient = require('mongodb').MongoClient;
    const dbconfig = require('../configs/app.config');

    dbConnector.init = async(app) =>{
            MongoClient.connect(dbconfig.url,{useNewUrlParser: true }).then((client) => {
            const db =client.db(`${dbconfig.db}`);
            var k = require("./../modules/user/saveUser.helper");
            k.saveUser(db);
           
        //    app.locals.db = db;
        global.db = db;
        //    console.log('connection success....', app.locals.db);
       }).catch((err) => {
           console.log('Database connection denied => ', err.stack );
       });

    }
})(module.exports)