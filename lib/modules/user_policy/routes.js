const appPolicy = require('./index');
const router = require('express').Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

// router.post('/policy/add', authMidd.checkToken,authorizeMidd.authorize,appPolicy.addPolicy);
router.post('/policy/add',authMidd.checkToken,authorizeMidd.authorize,appPolicy.addPolicy);
router.get('/policy/',authMidd.checkToken,authorizeMidd.authorize,appPolicy.getPolicy);
router.get('/policy/:id', authMidd.checkToken,authorizeMidd.authorize ,appPolicy.getPolicyById);
router.put('/policy/update/:id', authMidd.checkToken,authorizeMidd.authorize,appPolicy.updateById);
router.patch('/policy/patch/:id', authMidd.checkToken,authorizeMidd.authorize, appPolicy.patchById);
router.delete('/policy/delete/:id', authMidd.checkToken,authorizeMidd.authorize,appPolicy.deleteById);

module.exports = router;