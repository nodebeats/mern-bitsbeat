((routeHelper) => {
    'use strict';
    // const express = require('express');
    // const route = express.Router();

    routeHelper.init = (app) => {
        console.log("Routing invoked");
        const userRoute= require("./../modules/user/routes")
        app.use("/api/user",userRoute);
        const appRoute = require('../modules/user_policy/routes');
        app.use('/api/app-policy', appRoute);
     

        const UserRole = require('../modules/roles/routes');
        app.use('/api/userRoles', UserRole);
    };
   
})(module.exports);