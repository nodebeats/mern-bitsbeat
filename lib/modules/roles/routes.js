const index = require("./index"),
  express = require("express"),
  router = express.Router();

router.post("/role/add",index.addRole);
router.get("/role/read",index.readRole);
router.get("/role/read/:id",index.readroleById);
router.put("/role/update/:id",index.UpdateById);
router.patch("/role/delete/:id",index.deleteById);

module.exports = router;
