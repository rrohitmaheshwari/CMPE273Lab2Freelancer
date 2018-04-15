var mongo = require("./mongo");
var mongoURL = "mongodb://freelancerdb:freelancerdb@ds133659.mlab.com:33659/freelancerdb";
//var bcrypt = require('bcrypt');
var crypto = require('crypto');

function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));
    mongo.myconnect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('users');
        key = "273"
        var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
        hash.update(msg.password);
        msg.password = hash.digest('hex');
        coll.findOne({username: msg.username, password: msg.password}, function (err, user) {
            if (user) {

                res.code = "200";
                res.value = user;
                console.log(user);
                console.log(res.value);

            } else {

                res.code = "400";
                res.value = "Failed Login";
                console.log(res.value);
            }
            console.log("inside try:" + res);
            callback(null, res);
        });
    })

}

exports.handle_request = handle_request;