const index = require('./index'),
      multer_upload = require('../../helpers/multer.helper'),
      router = require('express').Router();
const upload = multer_upload.upload_image;

router.route('/')
        .post(upload.single('myfile'),index.createBlog)
        .get(index.getBlog)

router.route('/:id')
        .get(index.getBlogById)
        .put(upload.single('myfile'),index.UpdateById)
        .patch(index.deleteById)

module.exports = router;