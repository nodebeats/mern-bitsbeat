
var express = require("express");
var router = express.Router();

const errorController = require("./index");


router.get("/error", errorController.getAllErrors);


module.exports = router;
