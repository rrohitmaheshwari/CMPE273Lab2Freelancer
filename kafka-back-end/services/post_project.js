var projects = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};

    var myObj = new projects({
        emp_username: msg.username,
        title: msg.request.title,
        description: msg.request.description,
        budget_range: msg.request.budget_range,
        skills_req: msg.request.skills_req,
        status: msg.request.status,
        complete_by: msg.request.complete_by,
        filenames: msg.request.filenames + ",",
        freelancer_username: msg.request.freelancer_username,
        bids: []

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