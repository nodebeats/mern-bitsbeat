((dbConnector) => {
    'use strict';
    const MongoClient = require('mongodb').MongoClient;
    const dbconfig = require('../configs/app.config');

    dbConnector.init = async (app) => {
        MongoClient.connect(dbconfig.url, { useNewUrlParser: true }).then(async (client) => {
            
            const db = client.db(`${dbconfig.db}`);         
            global.db = db;

            const collection = db.collection("User");
            const k = await collection.findOne({ user_role: "superuser" });

            if (!k) {
                console.log("I am here to create super user");
                const super_user = require("./../modules/user/index");
                const super_user_config = require('./../modules/user/config');
                await super_user.saveUser(super_user_config.messageConfig.default_super_user);
            }
   
        }).catch((err) => {
            console.log('Database connection denied => ', err.stack);
        });

    }
})(module.exports)