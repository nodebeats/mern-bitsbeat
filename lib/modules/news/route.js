const newsModule = require('./index'),
      upload = require('../../helpers/multer.helper')
router = require('express').Router();

router.route('/')
      .post(upload.single('myfile'), newsModule.addNews)
      .get(newsModule.getNews)
//   .get(newsModule.filternewsCategory);
router.route('/filter/:categorySlug')
      .get(newsModule.filternewsCategory);

router.route('/:id')
      .get(newsModule.getNewsById)
      .put(upload.single('myfile'), newsModule.updateNewsById)
      .patch(newsModule.patchNewsById);

module.exports = router;