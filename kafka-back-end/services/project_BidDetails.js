var Project = require('../model/Project');
var mongodb = require("mongodb");

function handle_request(msg, callback) {

    var res = {};
    console.log("In project_BidDetails.js handle_request():");
    var pipeline = [
        {
            "$match": {
                "_id": new mongodb.ObjectID(msg.project_id)
            }
        }, 
        {
            "$project": {
                "bids": 1.0
            }
        }, 
        {
            "$unwind": {
                "path": "$bids",
                "preserveNullAndEmptyArrays": true
            }
        }
    ];

    var promise = Project.aggregate(pipeline);

    promise.then(function (data) {
        console.log("project_BidDetails.js data-");
        console.log(data);
        res.value = data;
        if (data) {
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