const appPolicy = require('./index');
const router = require('express').Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

// router.post('/policy/add', authMidd.checkToken,authorizeMidd.authorize,appPolicy.addPolicy);
router.post('/policy/add',appPolicy.addPolicy);
router.get('/policy/',appPolicy.getPolicy);
router.get('/policy/:id', appPolicy.getPolicyById);
router.put('/policy/update/:id', appPolicy.updateById);
router.patch('/policy/patch/:id', appPolicy.patchById);
router.delete('/policy/delete/:id',appPolicy.deleteById)

module.exports = router;