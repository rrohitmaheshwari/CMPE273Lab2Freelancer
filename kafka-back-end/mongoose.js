// Mongoose Setup - MongoDB - ORM
const mongoose      = require("mongoose");
const options       = {
   // autoIndex: false, // Don't build indexes
    poolSize: 10,
};
mongoose.Promise    = global.Promise;
//mongoose.connect('mongodb://localhost:27017/freelancerdb', options);
mongoose.connect('mongodb://freelancerdb:freelancerdb@ds133659.mlab.com:33659/freelancerdb', options);

module.exports = mongoose;