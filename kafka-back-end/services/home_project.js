var projects = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log("In home_project.js handle request:");

    //@TODO find only relevant projects
    // fetch all projects
    var promise = projects.find({
        status          : "Open",
        emp_username    : { $ne: msg.username }
    }).exec();

    promise.then(function (data) {
        console.log("home_project.js data-");
        console.log(data);
        res.value = data;
        if (data) {
            res.code = 201;
            callback(null, res);
        }else {
            res.code = 200;
            callback(null, res);
        }
    }).catch(function (err) {
        // just need one of these
        console.log('error:', err.message);
        res.code = '400';
        callback(null, res);
    });
}

exports.handle_request = handle_request;