var projects = require('../model/Project');


function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    res.value = msg;
    res.code = 200;

    var promise = projects.find().exec();


    promise.then(function (data) {
        console.log("data-")
        console.log(data)
        res.value = data;
        if (data) {
            res.code = 201;
            callback(null, res);
        }
        else {
            res.code = 200;
            callback(null, res);
        }
    })


        .catch(function (err) {
            // just need one of these
            console.log('error:', err.message);
            res.code = '400';
            callback(null, res);
        });


}


exports.handle_request = handle_request;