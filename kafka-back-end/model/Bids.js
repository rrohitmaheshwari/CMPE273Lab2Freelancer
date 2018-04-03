var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var Bids = new Schema({

    user_id: {type: String},
    project_id: {type: String},
    bid_price: {type: Number},
    days_req: {type: String}


});



module.exports = mongoose.model('Bids', Bids, 'Bids');