
var express = require("express");
var router = express.Router();

var loginController = require("./index");
var passport = require('passport');
 require('../../configs/passport');


router.post("/login",passport.authenticate('local',{ session: false }),loginController.login_user);
module.exports = router;