
var crypto = require('crypto');

var User = require('../model/user');


function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));


    var key = "273";

    var hash = crypto.createHmac('sha512', key); //encrytion using SHA512
    console.log(msg);
    hash.update(msg.password);
    msg.password = hash.digest('hex');


    var myobj = new User({
        username: msg.username,
        password: msg.password,
        name: msg.name,
        email: msg.email,
        looking_for: msg.looking_for,
    });

    res.value = msg;
    res.code = 200;


    var promise = myobj.save();


    promise.then(function () {
        res.value = msg;
        res.code = 200;
        callback(null, res);
    })


        .catch(function (err) {
            // just need one of these
            console.log('error:', err.message);
            if (err.message.includes("username_1 dup key:"))
                res.value = 'This username already exists!';
            else if (err.message.includes("email_1 dup key:"))
                res.value = 'This email already exists!';
            else
                res.value = 'Error in registering data please try again!';

            res.code = '400';
            callback(null, res);
        });




}


exports.handle_request = handle_request;