
var express = require("express");
var router = express.Router();

var loginController = require("./index");


router.post("/login", loginController.login_user);

module.exports = router;