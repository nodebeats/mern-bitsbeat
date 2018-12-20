const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('./../../middlewares/token.authentication');
const userController = require("./index");

router.post("/create", userController.create_user);
router.get("/list",userController.listOfUser);
router.get("/userInfo/:id",userController.getUserById);
router.patch("/delete/:id",userController.deleteUser);
router.put("/update/:id",userController.updateUser);
router.post("/resendToken/:id",authenticationMiddleware.checkToken,userController.resendToken);
//router.get("/fetch",userController.redisFetch);

module.exports = router;