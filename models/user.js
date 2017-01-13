const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);