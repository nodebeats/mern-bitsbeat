const newsModule = require('./index'),
      upload=require('../../helpers/multer.helper')
      router = require('express').Router();
    
      router.route('/')
            .post(upload.single('myfile'), newsModule.addNews)
            .get(newsModule.getNews);
      router.route('/:id')
            .get(newsModule.getNewsById)
            .put(newsModule.updateNewsById)
            .patch(newsModule.patchNewsById);
      module.exports = router;