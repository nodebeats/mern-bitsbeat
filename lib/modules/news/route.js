const newsModule = require('./index'),
      upload=require('../../helpers/multer.helper')
      router = require('express').Router();

      router.post('/add',upload.single('myfile'), newsModule.addNews);
      router.get('/getAllNews', newsModule.getNews);
      router.get('/:id', newsModule.getNewsById);
      router.put('/update/:id', newsModule.updateNewsById);
      router.patch('/patch/:id', newsModule.patchNewsById);
      //router.delete('/delete/:id', newsModule.deleteNewsById)
      
      module.exports = router;