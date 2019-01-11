const index = require('./index'),
upload = require('../../helpers/multer.helper')
router = require('express').Router(),
authMidd = require('../../middlewares/token.authentication'),
authorizeMidd = require('../../middlewares/authorize.superadmin');


router.route('/')
        .post(upload.single('myfile'),index.createBlog)

        //.post(upload.single('myfile'),authMidd.checkToken,authorizeMidd.authorize,index.createBlog)
        .get(index.getBlog)

router.route('/:id')
        .get(index.getBlogById)
        .put(upload.single('myfile'),authMidd.checkToken,authorizeMidd.authorize,index.UpdateById)
        .patch(authMidd.checkToken,authorizeMidd.authorize,index.deleteById)

router.route('/filter/:categorySlug')
        .get(index.filterByCategoryTitle);

// router.route('/filterTag/:tagFilter')
//         .get(index.filterTags);


module.exports = router;