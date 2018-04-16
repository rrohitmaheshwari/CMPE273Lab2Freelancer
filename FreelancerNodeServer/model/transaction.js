const  mongoose     = require('../mongoose');

const  Schema       = mongoose.Schema;


// create a schema
var TransactionSchema = new Schema({
    from    : { type: String, trim: true},
    to      : { type: String, trim: true },
    type    : { type: String, trim: true },
    amount  : { type: Number, trim: true},
    Date    : { type: String, trim: true },
    project : { type: String, trim: true }
});


let Transaction = mongoose.model('Transaction', TransactionSchema,'Transactions');
module.exports =  Transaction;