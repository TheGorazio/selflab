var express = require('express');
var router = express.Router();

var PreviewSchema = require('../models/preview.js');

var mongoose = require('mongoose');

var Preview = mongoose.model('Preview', PreviewSchema);

/* 
    PREVIEWS PAGE
*/
router.get('/', (req,res,next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));

    Preview.find()
        .then((previews) => {
            console.log(previews);
            mongoose.disconnect();                    
            res.render('previews/index', {
                title: 'Previews',
                previews: previews
            });
        })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();        
        });
});

/* 
    GET ALL PREVIEWS
    FORMAT: JSON
    METHOD: GET
*/
router.get('/all', (req, res, next) => {
    res.send(previews);
    res.end();
});

/*
    NEW PREVIEW PAGE
*/
router.get('/new', (req, res, next) => {
    res.render('previews/new', {
        title: 'New Preview'
    });
});
/*
    CREATE PREVIEW
    PARAMS:
        NAME - STRING
        PHOTO - FILE
        GALLERY - ARRAY of URL
    METHOD: POST
*/
router.post('/create', (req, res, next) => {
    if (req.body.name && req.body.photoUrl) {
        mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
        var db = mongoose.connection;
            db.on('error', (error) => console.error(error));
    
        var preview = new Preview({
            id: generateID(),
            name: req.body.name,
            photo: req.body.photoUrl,
            gallery: req.body['gallery[]'] ? req.body['gallery[]'] : []
        });
        preview.save()
            .then((prev) => {
                mongoose.disconnect();                        
                res.send('Ok');
            })
            .catch((err) => {
                mongoose.disconnect();        
                res.send(err);
            });
    } else {
        res.status(500).send('No preview data received');
        res.end();
    }
});

/* 
    EDIT PREVIEW PAGE
    PARAMS:
        ID - NUMBER
    METHOD: GET
*/
router.get('/edit/:id', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Preview.findOne({ id: req.params.id})
    .then((preview) => {
        console.log(preview);
        mongoose.disconnect();                
        res.render('previews/edit', {
            title: `Preview - ${preview.name}`,
            preview: preview
        });
    })
    .catch((err) => {
        console.log(err);
        mongoose.disconnect();        
        res.render('error', {
            message: 'Photoset not found'
        });
    });
});

/*
    EDIT PREVIEW BY ID
    PARAMS:
        ID - NUMBER
        NAME - STRING
        PHOTO - FILE
        DESCRIPTION - STRING
    METHOD: POST
*/
router.post('/edit', (req, res, next) => {
    console.log(req.body);
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Preview.update({ id: req.body.id }, {
        $set: {
            "id": req.body.id,
            "name": req.body.name,
            "photo": req.body.photoUrl,
            "gallery": req.body['gallery[]']
        }
    })
    .then((preview) => {
        console.log(preview);
        mongoose.disconnect();                
        res.send('Preview edited');        
        res.end();
    })
    .catch((err) => {
        mongoose.disconnect();        
        res.render('error', {
            message: 'Photoset not found'
        });
    });
});

/*
    DELETE PREVIEW BY ID
    PARAMS:
        IN - NUMBER
    METHOD: POST
*/
router.post('/delete', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Preview.remove({ id: req.body.id})
        .then((result) => {
            console.log(result);
            mongoose.disconnect();                               
            res.send('Delete success.');        
        })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();
            res.send('Preview not found');
            res.end();
        });
});

/* 
    GET PREVIEW BY ID
    PARAMS:
        ID - NUMBER
    METHOD: GET
*/
router.get('/:id', (req, res, next) => {
    mongoose.connect('mongodb://thegorazio:408528867@ds054479.mlab.com:54479/selflab');
    var db = mongoose.connection;
        db.on('error', (error) => console.error(error));
    
    Preview.findOne({ id: req.params.id})
        .then((preview) => {
            console.log(preview);
            mongoose.disconnect();            
            res.render('previews/single', {
                title: `Preview - ${preview.name}`,
                preview: preview
            });
        })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();
            res.render('error', {
                message: 'Photoset not found'
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