const index = require('./index'),
    express = require('express'),
    router = express.Router();

router.route('/')
        .post(index.createBlog)
        .get(index.getBlog)

router.route('/:id')
        .get(index.getBlogById)
        .put(index.UpdateById)
        .patch(index.deleteById)

module.exports = router;