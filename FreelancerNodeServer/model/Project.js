const  mongoose     = require('../mongoose');
const  Schema       = mongoose.Schema;

var BidsSchema = new Schema({

    username    : { type: String, trim: true },
    name        : { type: String, trim: true },
    bid_price   : { type: Number, trim: true },
    days_req    : { type: Number, trim: true }
});

// create a schema
var ProjectSchema = new Schema({

    emp_username        : { type: String, trim: true },
    title               : { type: String, trim: true },
    description         : { type: String, trim: true, default: '' },
    budget_range        : { type: String, trim: true, default: '' },
    skills_req          : { type: String, trim: true, default: '' },
    status              : { type: String, trim: true, default: '' },
    complete_by         : { type: String, trim: true, default: '' },
    filenames           : { type: String, trim: true, default: '' },
    freelancer_username : { type: String, trim: true, default: '' },
    bids                : [{ type: BidsSchema}],
    freelancer_files           : { type: String, trim: true, default: '' },
});

let Project = mongoose.model('Project', ProjectSchema,'projects');
module.exports =  Project;