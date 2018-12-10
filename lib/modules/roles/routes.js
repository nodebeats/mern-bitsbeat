const index = require("./index"),
  //config = require('./config'),
  express = require("express"),
  router = express.Router();
  const middleware = require('.././../middlewares/auth.middleware')


// router.post("/role/add",middleware.checkSA,middleware.checkUserRole, index.addRole);
// router.get("/role/read",middleware.checkSA,middleware.checkUserRole, index.readRole);
// router.get("/role/read/:id",middleware.checkSA, middleware.checkUserRole,index.readroleById);
// router.put("/role/update/:id",middleware.checkSA, index.UpdateById);
// router.patch("/role/delete/:id",middleware.checkSA, index.deleteById);


router.post("/role/add",index.addRole);
router.get("/role/read",index.readRole);
router.get("/role/read/:id",index.readroleById);
router.put("/role/update/:id",index.UpdateById);
router.patch("/role/delete/:id",index.deleteById);

module.exports = router;
