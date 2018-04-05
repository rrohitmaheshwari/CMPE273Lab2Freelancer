
const User          = require('../model/user');

function handle_request(msg, callback) {

    var res = {};
    console.log("In getUser.js handle_request():");

    User.findOne({username: msg.username}, function (err, user) {
        if (user) {

            res.code = "200";
            res.value = user;
            console.log(user);
            console.log(res.value);
        } else {
            
            res.code = "400";
            res.value = "Could not find User";
            console.log(res.value);
        }
        
        callback(null, res);
    });
}

exports.handle_request = handle_request;