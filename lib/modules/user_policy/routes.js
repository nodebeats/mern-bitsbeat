const appPolicy = require('./index');
const router = require('express').Router();

router.post('/policy/add', appPolicy.addPolicy);
router.get('/policy/getAllPolicy', appPolicy.getPolicy);
router.get('/policy/:id', appPolicy.getPolicyById);
router.put('/policy/update/:id', appPolicy.updateById);
router.patch('/policy/patch/:id', appPolicy.patchById);
router.delete('/policy/delete/:id', appPolicy.deleteById)

module.exports = router;