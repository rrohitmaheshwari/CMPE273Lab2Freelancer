var Transaction = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};

    var myObj = new Transaction({
        from: msg.request.from,
        to: msg.request.to,
        type: msg.request.type,
        amount: msg.request.amount,
        Date: msg.request.Date,
    });

    var promise = myObj.save();

    promise
        .then(function (data) {
            console.log("data-")
            console.log(data)
            res.value = data;
            res.code = '200';
            callback(null, res);
        })
        .catch(function (err) {
            console.log('error:', err.message);
            res.code = '400';
            callback(null, res);
        });
}
exports.handle_request = handle_request;