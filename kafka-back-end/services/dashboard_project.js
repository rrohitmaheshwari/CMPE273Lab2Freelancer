var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log("dashboard_project");

    var pipeline = [
        {
            "$match": {
                "emp_username": {
                    $eq: msg.username 
                }
            }
        }, 
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        }, 
        {
            "$group": {
                "_id": {
                    "id": "$_id",
                    "title": "$title",
                    "complete_by": "$complete_by",
                    "status": "$status",
                    "freelancer_username": "$freelancer_username",
                    "emp_username": "$emp_username"
                },
                "avg_bid": {
                    "$avg": "$bids.bid_price"
                }
            }
        }
    ];

    // Test code
    var promise = Project.aggregate(pipeline).exec();

    // Test code    
    // fetch all projects
    // var promise = Project.find({
    //     emp_username    : { $eq: msg.username }
    // }).exec();

    promise.then(function (data) {
        console.log("dashboard_project.js data-");
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
        callback(err, res);
    });
}

exports.handle_request = handle_request;