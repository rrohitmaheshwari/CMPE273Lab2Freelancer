const  mongoose     = require('../mongoose');

const  Schema       = mongoose.Schema;


// create a schema
var UserSchema = new Schema({
    username    : { type: String, trim: true, index: { unique: true }},
    email       : { type: String, trim: true, index: { unique: true } },
    password    : { type: String, required: true },
    name        : { type: String, trim: true, default: '' },
    summary     : { type: String, trim: true, default: '' },
    phone       : { type: String, trim: true, default: '' },
    about_me    : { type: String, trim: true, default: '' },
    skills      : { type: String, trim: true, default: '' },
    looking_for : { type: String, trim: true, default: '' }
});


let User = mongoose.model('User', UserSchema,'users');
module.exports =  User;