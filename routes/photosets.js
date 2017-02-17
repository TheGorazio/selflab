var express = require('express');
var router = express.Router();

var PhotosetSchema = require('../models/photoset.js');

var mongoose = require('mongoose');


var Photoset = mongoose.model('Photoset', PhotosetSchema);

/*
    PHOTOSETS PAGE
*/
router.get('/', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));

    Photoset.find()
        .then((photosets) => {
            console.log(photosets);
            mongoose.disconnect();
            res.render('photosets/index', {
                title: 'Photosets',
                photosets: photosets
            });
        })
        .catch((err) => {
            mongoose.disconnect();
            console.log(err);
        });
});

/*
    NEW PHOTOSET PAGE
*/
router.get('/new', (req, res, next) => {
    res.render('photosets/new', {
        title: 'New photosets'
    });
});
/*
    CREATE PHOTOSET
    PARAMS:
        NAME - STRING
        PHOTO - FILE
        GALLERY - ARRAY of URL
    METHOD: POST
*/
router.post('/create', (req, res, next) => {
    console.log(req.body);
    if (req.body.name && req.body.description) {
        mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
        var db = mongoose.connection;
            db.on('error', (error) => console.error(error));

        var photoset = new Photoset({
            id: generateID(),
            name: req.body.name,
            description: req.body.description,
            gallery: req.body['gallery[]'] ? req.body['gallery[]'] : []
        });
        photoset.save()
            .then((prev) => {
                mongoose.disconnect();
                res.send('Ok');
            })
            .catch((err) => {
                mongoose.disconnect();                
                res.send(err);
            });
    } else {
        res.status(500).send('No photoset data received');
        res.end();
    }
});

/*
    DELETE PHOTOSET BY ID
    PARAMS:
        IN - NUMBER
    METHOD: POST
*/
router.post('/delete', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Photoset.remove({ id: req.body.id})
        .then((result) => {
            console.log(result);
            mongoose.disconnect();                               
            res.send('Delete success.');        
        })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();
            res.send('Phooset not found');
            res.end();
        });
});

/* 
    GET PHOTOSET BY ID
    PARAMS:
        ID - NUMBER
    METHOD: GET
*/
router.get('/:id', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Photoset.findOne({ id: req.params.id})
        .then((photoset) => {
            console.log(photoset);
            res.render('photosets/single', {
                title: `photoset - ${photoset.name}`,
                photoset: photoset
            });
        })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();
            res.render('error', {
                message: 'Preview not found'
            });
        });
});

function generateID() {
    var id = '';
    var alphabet = 'qwert1yu23io4p5[6]7a8s9d0fghjklindexjszxcvbnm';
    for (var i = 0; i < 6; i++) {
        id += alphabet[Math.round(Math.random() * alphabet.length)];
    }
    return id;
}

module.exports = router;