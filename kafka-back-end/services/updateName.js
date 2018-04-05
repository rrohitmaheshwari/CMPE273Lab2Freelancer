var User = require('../model/user');

function handle_request(msg, callback) {

    var res = {};

    User.findOneAndUpdate({username: msg.username}, {$set:{name:msg.name}}, {new: true}, function (err, doc) {
        if (err) {
            res.code = "400";
            res.value = "Cannot set 'Name' at the moment";
            console.log(res.value);
            callback(err, res);
        }
        else{
        res.code = "200";
        res.value = doc;
        console.log(doc);
        callback(null, res);
        }
    });    
}

exports.handle_request = handle_request;