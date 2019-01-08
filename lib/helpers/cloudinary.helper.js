const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'slowrock',
    api_key: '382754952893714',
    api_secret: 'doamgLx9ul6yNrd0-xlRzf5nprc'
})

const uniqueFilename = new Date().toISOString();

var uploadCloudinary = async(req,res,next) => {cloudinary.v2.uploader.upload(req.file.path,
    {
        public_id: `picture/${uniqueFilename}`,
        crop: 'limit',
        width: 2000,
        height: 2000,
        eager: [
            {
                width: 200, height: 200, crop: 'thumb', gravity: 'face',
                radius: 20, effect: 'sepia'
            },
            { width: 100, height: 150, crop: 'fit', format: 'png' }],
        tags: ['special', 'for_homepage']
    },
    function (err, result){ 
        if(err) return res.json(err) 

        console.log('file uploaded to Cloudinary')
         // remove file from server
        //  const fs = require('fs');
        //  fs.unlinkSync(req.file.path)
         // return image details
         
    });

    next();
}
module.exports = uploadCloudinary;