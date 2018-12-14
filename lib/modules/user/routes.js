var express = require("express");
var router = express.Router();

var userController = require("./index");

router.post("/create", userController.create_user);
router.get("/list",userController.listOfUser);
router.get("/userInfo/:id",userController.getUserById);
router.patch("/delete/:id",userController.deleteUser);
router.put("/update/:id",userController.updateUser);

router.get("/verify",userController.verifyEmail);

module.exports = router;