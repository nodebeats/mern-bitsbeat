const newsCategory = require ('./index'),
      router = require('express').Router();

      router.route('/')
            .post(newsCategory.addNewsCategory)
            .get(newsCategory.getNewsCategory);
      router.route('/:id')
            .get(newsCategory.getNewsCategoryById)
            .put(newsCategory.updateNewsCategoryById)
            .patch(newsCategory.patchNewsCategoryById);
module.exports = router;
      