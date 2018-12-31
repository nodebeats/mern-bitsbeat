const index = require("./index"),
  express = require("express"),
  router = express.Router();
const authMidd = require('../../middlewares/token.authentication');
const authorizeMidd = require('../../middlewares/authorize.superadmin');

<<<<<<< HEAD
router.route('/')
    .post(index.addRole)
    .get(index.readRole)

router.route('/:id')
      .get(index.readroleById)
      .put(index.UpdateById)
      .patch(index.deleteById);
=======
router.post("/role/add", authMidd.checkToken, authorizeMidd.authorize, index.addRole);

// router.post("/role/add",index.addRole);
router.get("/role/read", authMidd.checkToken, authorizeMidd.authorize, index.readRole);
router.get("/role/read/:id", authMidd.checkToken, authorizeMidd.authorize, index.readroleById);
router.put("/role/update/:id", authMidd.checkToken, authorizeMidd.authorize, index.UpdateById);
router.patch("/role/delete/:id", authMidd.checkToken, authorizeMidd.authorize, index.deleteById);
>>>>>>> 6180799825aa8dc3edc97e53b43d76084b826f33

module.exports = router;
