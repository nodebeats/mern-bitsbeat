// exports.fileHandler = (req, res, next =>{
// try {
var multer = require('multer');
const path = require('path');
//var upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
var upload = multer({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg') {

      return cb(null, true)

    }
    return cb(new Error('Only images are allowed'))
  }
  , storage: storage
});
module.exports = upload;

