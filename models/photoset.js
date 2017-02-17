const mongoose = require('mongoose');

var PhotosetSchema = new mongoose.Schema({
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
    description: {
        type: String
    },
    gallery: {
        type: [String]
    }
});

module.exports = PhotosetSchema;