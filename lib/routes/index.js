((routeHelper) => {
    'use strict';

    routeHelper.init = (app) => {
        console.log("Routing invoked");
        const route= require("./../modules/user/routes")
        app.use("/api/user",route);
    };
})(module.exports);