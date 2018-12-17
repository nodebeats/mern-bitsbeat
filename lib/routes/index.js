((routeHelper) => {
    'use strict';
    // const express = require('express');
    // const route = express.Router();

    routeHelper.init = (app) => {
        console.log("Routing invoked");

            const loginRoute = require('../modules/login/routes'),
            errorRoute = require('../modules/errorlogs/routes'),
            logoutRoute = require('../modules/logout/routes');

        app.use('/api/', loginRoute);
        app.use('/api/', logoutRoute);
        app.use('/api/', errorRoute);

        const userRoute= require("./../modules/user/routes")
        app.use("/api/user",userRoute);
        //routing for apppolicy
        const appRoute = require('../modules/user_policy/routes');
        app.use('/api/app-policy', appRoute);
     
        const UserRole = require('../modules/roles/routes');
        app.use('/api/userRoles', UserRole);
        //routing for news module
        const newsModule = require('../modules/news/route');
        app.use('/api/news',newsModule);
    };
   
})(module.exports);