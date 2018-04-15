var Project = require('../model/Project');
var mongodb = require("mongodb");

function handle_request(msg, callback) {

    var res = {};
    console.log("In project_details.js handle_request():");
    var pipeline = [
        {
            "$match": {
                "_id": new mongodb.ObjectID(msg.project_id)
            }
        },
        {
            "$addFields": {
                "bid_count": {
                    "$size": { "$ifNull": [ "$bids", [] ] } //{ $ifNull: [ <expression>, <replacement-expression-if-null> ] }
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
                    "id"                    : "$_id",
                    "title"                 : "$title",
                    "complete_by"           : "$complete_by",
                    "status"                : "$status",
                    "freelancer_username"   : "$freelancer_username",
                    "emp_username"          : "$emp_username",
                    "budget_range"          : "$budget_range",
                    "skills_req"            : "$skills_req",
                    "description"           : "$description",
                    "filenames"             : "$filenames",
                    "bid_count"				: "$bid_count",
                    "freelancer_files"		: "$freelancer_files",
                },
                "avg_bid": {
                    "$avg": "$bids.bid_price"
                }
            }
        }
    ];

    // Test code
    var promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("project_details.js data-");
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