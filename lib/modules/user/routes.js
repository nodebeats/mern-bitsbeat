const express = require("express");
const router = express.Router();
const authenticationMiddleware = require('./../../middlewares/token.authentication');
const userController = require("./index");
const upload = require('../../helpers/multer.helper');

router.route('/')
    .post(upload.single('myfile'), userController.create_user)
    .get(userController.listOfUser);

router.route("/subscribe/anonymous")
    .post(userController.anonymousUser);

router.route('/verify/email') 
      .get(userController.verifyEmail);

router.route("/unsubscribe/:id")
    .patch(userController.unsubscribe);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.deleteUser)
    .put(upload.single('myfile'), userController.updateUser)
    .post(authenticationMiddleware.checkToken, userController.resendToken);
//router.get("/fetch",userController.redisFetch);

// router.get("/verify",userController.verifyEmail);

module.exports = router;
