((routeHelper) => {
    'use strict';

    routeHelper.init = (app) => {
        console.log("Routing invoked");
        const userRoute= require("./../modules/user/routes")
        app.use("/api/user",userRoute);
        const appRoute = require('../modules/user_policy/routes');
        app.use('/api/app-policy', appRoute);
     

    };
})(module.exports);