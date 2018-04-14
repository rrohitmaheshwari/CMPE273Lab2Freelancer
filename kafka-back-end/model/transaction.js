const  mongoose     = require('../mongoose');

const  Schema       = mongoose.Schema;


// create a schema
var Transaction = new Schema({
    from    : { type: String, trim: true},
    to      : { type: String, trim: true },
    type    : { type: String, trim: true },
    amount  : { type: Number, trim: true},
    Date    : { type: String, trim: true },
});


let transaction = mongoose.model('User', Transaction,'users');
module.exports =  transaction;