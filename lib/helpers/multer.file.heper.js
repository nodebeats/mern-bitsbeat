const multer = require('multer');
const path = require('path');


const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/files`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
const uploadFile = multer({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext === '.pdf' || !ext === '.txt' || !ext === '.docs') {

      return cb(null, true)

    }
    return cb(new Error('Only files are allowed'))
  }
  , storage: storageFile
});

module.exports = {
    fileUpload:uploadFile,
    imageUpload:upload
};

