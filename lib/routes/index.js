((routeHelper) => {
    'use strict';
    // const express = require('express');
    // const route = express.Router();

    routeHelper.init = (app) => {
        console.log("Routing invoked");
        const UserRole = require('../modules/roles/routes');
        app.use('/api/userRoles', UserRole);
    };
   
})(module.exports);