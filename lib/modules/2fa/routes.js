var express = require("express");
var router = express.Router();

const setup2FA = require("./index");
const authMidd = require('../../middlewares/token.authentication');



router.post('/setup2FA', authMidd.checkToken, setup2FA.setup2FAinApp);
router.post('/verify2FA', authMidd.checkToken, setup2FA.verifySecretKey);
router.delete('/disable2FA', authMidd.checkToken, setup2FA.deleteSecretKey);




module.exports = router;
