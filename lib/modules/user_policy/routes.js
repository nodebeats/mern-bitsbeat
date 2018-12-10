const appPolicy = require('./index');
const router = require('express').Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');


router.post('/policy/add',authMidd.checkToken,authorizeMidd.authorize, appPolicy.addPolicy);
router.get('./policy/getAllPolicy',appPolicy.getPolicy);
router.get('./policy/:id', appPolicy.getById);
router.put('/policy/update/:id', appPolicy.updateById);
router.delete('/policy/delete/:id', appPolicy.deleteById);

module.exports = router;