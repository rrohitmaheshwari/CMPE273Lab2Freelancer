var mongoose = require('mongoose');

// create a schema
var user = new mongoose.Schema({

    username: { type: String, unique: true},
    password: { type: String },
    name: String,
    email: { type: String, unique: true},
    looking_for: String
});

module.exports = mongoose.model('user', user,'user');