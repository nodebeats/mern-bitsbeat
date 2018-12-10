
var express = require("express");
var router = express.Router();

var logoutController = require("./index");
const authMidd = require('../../middlewares/token.authentication');



router.post("/logout",authMidd.checkToken, logoutController.logout_user);

module.exports = router;