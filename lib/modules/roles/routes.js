const index = require("./index"),
  express = require("express"),
  router = express.Router();

router.post("/",index.addRole);
router.get("/",index.readRole);
router.get("/:id",index.readroleById);
router.put("/:id",index.UpdateById);
router.patch("/:id",index.deleteById);

module.exports = router;
