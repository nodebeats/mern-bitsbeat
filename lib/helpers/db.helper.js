((dbConnector) => {
    'use strict';
    const MongoClient = require('mongodb').MongoClient;
    const dbconfig = require('../configs/app.config');

    dbConnector.init = async(app) =>{
      //  console.log(dbconfig);
       // console.log(`mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}:`);
<<<<<<< HEAD
        //MongoClient.connect(`mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}/${dbconfig.db}`,{useNewUrlParser: true }).then((client) => {
            MongoClient.connect(dbconfig.url,{useNewUrlParser: true }).then((client) => {
            const db =client.db(`${dbconfig.db}`);
            // let k = db.collection("User").findOne({user_role:"superadmin"});
            // if(!k){
               
            // }
            var k = require("./../modules/user/saveUser.helper");
            k.saveUser(db);
            
=======
        MongoClient.connect(`mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.host}:${dbconfig.port}/${dbconfig.db}`,{useNewUrlParser: true }).then((client) => {

            const db =client.db('cms');
>>>>>>> f564c9f0fd3e6b49188e1566529a9e6f4f000ded
           
        //    app.locals.db = db;
        global.db = db;
        //    console.log('connection success....', app.locals.db);
       }).catch((err) => {
           console.log('Database connection denied => ', err.stack );
       });

    }
})(module.exports)