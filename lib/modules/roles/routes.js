const index = require("./index"),
  express = require("express"),
  router = express.Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

// router.post("/role/add", authMidd.checkToken, authorizeMidd.authorize, index.addRole);
router.post("/role/add", index.addRole);

router.post("/role/add1", authMidd.checkToken, authorizeMidd.authorize, index.addRole);
// router.post("/role/add",index.addRole);
router.get("/role/read", authMidd.checkToken, authorizeMidd.authorize, index.readRole);
router.get("/role/read/:id", authMidd.checkToken, authorizeMidd.authorize, index.readroleById);
router.put("/role/update/:id", authMidd.checkToken, authorizeMidd.authorize, index.UpdateById);
router.patch("/role/delete/:id", authMidd.checkToken, authorizeMidd.authorize, index.deleteById);

module.exports = router;
