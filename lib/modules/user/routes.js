var express = require("express");
var router = express.Router();

var userController = require("./index");

router.post("/create", userController.create_user);

module.exports = router;