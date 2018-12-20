// exports.fileHandler = (req, res, next =>{
// try {
    var multer  = require('multer')
    //var upload = multer({ dest: 'uploads/' })
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `${__dirname}/public/images`)
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now()+ file.originalname)
        }
      })
      var upload = multer({ storage: storage });
     module.exports = upload;
//       var photoloader= upload.single('myFile') = (req,res,next =>{
//        const file = req.file
//        if(file){
//            res.send('file');
//            next();
//        }   
//       })
// } catch (err) {
//     res.send('Error')
    
// }
// })
        
