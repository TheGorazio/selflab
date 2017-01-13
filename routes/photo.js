const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});
const upload = multer({ storage: storage });

cloudinary.config({
    cloud_name: 'dg91krvtc',
    api_key: '592784594989663',
    api_secret: 'JnVbjBjOnECYa_x9VwIk5pShcQU'
});

/*
    UPLOAD PHOTO
    PARAMS:
        FILE {*.PNG, *.JPG, *.JPEG, *.BMP}
    METHOD:
        POST
*/
router.post('/upload', upload.single('photo'), (req, res, next) => {
    console.log(req.file);
    try {
        cloudinary.uploader.upload(req.file.path, function(error, result) { 
            if (!error) {
                console.log('photo uploaded successfully');
                res.status(200).send(result.secure_url);
                res.end();
            } else {
                console.log('photo uploading error', error);
                res.status(501).send('Error');
                res.end();
            }        
        });
    } catch (e) {
        console.log(`cathed ${e}`);
    }
});

/*
    DELETING PHOTOS
    PARAMS:
        ARRAY of URLS - STRING
    METHOD:
        POST
*/
router.post('/delete', (req, res, next) => {
    console.log(req.body['photos[]']);
    var error = false;
    var photos = req.body['photos[]'];
        photos.map((photo) => {
            cloudinary.uploader.destroy(photo, function(err, result) {
                console.log(result);
                if (err) error = true;
            });
        });
    if (error) res.status(500).send('Error');
    else res.status(200).send('Images successfully deleted');
});

module.exports = router;