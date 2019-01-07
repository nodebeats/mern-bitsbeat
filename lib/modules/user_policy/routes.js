const appPolicy = require('./index');
const router = require('express').Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

// router.route('/')
//     .post(authMidd.checkToken,authorizeMidd.authorize,appPolicy.addPolicy)
//     .get(authMidd.checkToken,authorizeMidd.authorize,appPolicy.getPolicy);

    router.route('/')
    .post(appPolicy.addPolicy)
    .get(appPolicy.getPolicy);
    
router.route('/:id')
    .get(appPolicy.getPolicyById)
    .put(authMidd.checkToken,authorizeMidd.authorize,appPolicy.updateById)
    .patch(authMidd.checkToken,authorizeMidd.authorize, appPolicy.patchById)
    .delete(authMidd.checkToken,authorizeMidd.authorize,appPolicy.deleteById)

module.exports = router;