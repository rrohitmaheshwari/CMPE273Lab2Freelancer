var Transaction = require('../model/transaction');

function handle_request(msg, callback) {



    var res = {};
    console.log("In getUser.js handle_request():");
console.log(msg);
    Transaction.find({$or: [
            {from: msg.username},
            {to: msg.username}
        ]}, function (err, result) {
        if (result) {

            res.code = "200";
            res.value = result;

        } else {

            res.code = "400";
            res.value = "Could not find details";
            console.log(res.value);
        }

        callback(null, res);
    });
}
exports.handle_request = handle_request;