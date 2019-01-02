const index = require("./index"),
  express = require("express"),
  router = express.Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

router.route('/')
  .post(authMidd.checkToken, authorizeMidd.authorize, index.addRole)
  .get(authMidd.checkToken, authorizeMidd.authorize, index.readRole)

router.route('/:id')
  .get(authMidd.checkToken, authorizeMidd.authorize, index.readroleById)
  .put(authMidd.checkToken, authorizeMidd.authorize, index.UpdateById)
  .patch(authMidd.checkToken, authorizeMidd.authorize, index.deleteById)

module.exports = router;
