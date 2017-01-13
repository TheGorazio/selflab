const mongoose = require('mongoose');

var PreviewSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    photo: {
        type: String
    },
    gallery: {
        type: [String]
    }    
});

module.exports = PreviewSchema;