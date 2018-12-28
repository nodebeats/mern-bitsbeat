const index = require("./index"),
  express = require("express"),
  router = express.Router();

router.route('/')
    .post(index.addRole)
    .get(index.readRole)

router.route('/:id')
      .get(index.readroleById)
      .put(index.UpdateById)
      .patch(index.deleteById);

module.exports = router;
