const index = require('./index'),
    express = require('express'),
    router = express.Router(),
    authMidd = require('../../middlewares/token.authentication'),
    authorizeMidd = require('../../middlewares/authorize.superadmin');


//  router.route('/')
//      .post(authMidd.checkToken, authorizeMidd.authorize,index.createBlogCategory)
//      .get(index.getBlogCategory)

router.route('/')
     .post(index.createBlogCategory)
     .get(index.getBlogCategory)

//  router.route('/:id')
//      .get(index.getBlogCategoryById)
//      .put(authMidd.checkToken, authorizeMidd.authorize,index.UpdateCategoryById)
//     .patch(authMidd.checkToken, authorizeMidd.authorize,index.deleteCategoryById)

router.route('/:id')
     .get(index.getBlogCategoryById)
     .put(index.UpdateCategoryById)
    .patch(index.deleteCategoryById)

module.exports = router;