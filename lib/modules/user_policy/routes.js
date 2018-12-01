const appPolicy = require('./index');
const router = require('express').Router();

router.post('/policy/add', appPolicy.addPolicy);
router.get('./policy/getAllPolicy',appPolicy.getPolicy);
router.get('./policy/:id', appPolicy.getById);
router.put('/policy/update/:id', appPolicy.updateById);
router.delete('/policy/delete/:id', appPolicy.deleteById);

module.exports = router;