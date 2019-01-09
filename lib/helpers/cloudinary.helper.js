const cloudinary = require('cloudinary');



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