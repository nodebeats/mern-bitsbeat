((routeHelper) => {
    'use strict';
    // const express = require('express');
    // const route = express.Router();

    routeHelper.init = (app) => {
        console.log("Routing invoked");
      
            const loginRoute = require('../modules/login/routes'),
            errorRoute = require('../modules/errorlogs/routes'),
            logoutRoute = require('../modules/logout/routes'),
            setup2FA = require('../modules/2fa/routes');

        app.use('/api/', loginRoute);
        app.use('/api/', logoutRoute);
        app.use('/api/', errorRoute);
        app.use('/api/', setup2FA);

        const userRoute= require("./../modules/user/routes");
        app.use("/api/user",userRoute);

        //routing for Blog
        const blogRoute = require('./../modules/blog/route');
        app.use('/api/blog',blogRoute);

          //routing for Blog-category
          const blogCategoryRoute = require('./../modules/blog-category/route');
          app.use('/api/blogCategory',blogCategoryRoute);
        
        //routing for apppolicy
        const appRoute = require('../modules/user_policy/routes');
        app.use('/api/app-policy', appRoute);
     
        const UserRole = require('../modules/roles/routes');
        app.use('/api/userRoles', UserRole);

         const verifyEmail = require('../modules/user/routes');
         app.use('/',verifyEmail);

        //routing for news module
        const newsModule = require('../modules/news/route');
        app.use('/api/news',newsModule);

    
    };
   
})(module.exports);