((routeHelper) => {
    'use strict';

    routeHelper.init = (app) => {
        console.log("Routing invoked");
        const appRoute = require('../modules/user_policy/routes'),
            loginRoute = require('../modules/login/routes'),
            errorRoute = require('../modules/errorlogs/routes'),
            createRoute = require('../modules/user/routes'),
            logoutRoute = require('../modules/logout/routes');

        app.use('/api/app-policy',appRoute);
        app.use('/api/', createRoute);
        app.use('/api/', loginRoute);
        app.use('/api/', logoutRoute);
        app.use('/api/', errorRoute);


    };
})(module.exports);