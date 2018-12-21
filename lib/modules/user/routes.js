const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('./../../middlewares/token.authentication');
const userController = require("./index");

router.post("/", userController.create_user);
router.get("/",userController.listOfUser);
router.get("/:id",userController.getUserById);
router.patch("/:id",userController.deleteUser);
router.put("/:id",userController.updateUser);
router.post("/:id",authenticationMiddleware.checkToken,userController.resendToken);
//router.get("/fetch",userController.redisFetch);

module.exports = router;