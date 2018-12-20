const index = require("./index"),
  //config = require('./config'),
  express = require("express"),
  router = express.Router();

  const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');


router.get("/role/read",authMidd.checkToken, authorizeMidd.authorize,index.readRole);
router.post("/role/add",index.addRole);
router.get("/role/read/:id",index.readroleById);
router.put("/role/update/:id",index.UpdateById);
router.patch("/role/delete/:id",index.deleteById);

module.exports = router;
