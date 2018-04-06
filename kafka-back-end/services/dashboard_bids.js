var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log("dashboard_bids");

    var pipeline = [
        {
            "$match": {
                "bids.username": {
                    $eq: msg.username
                }
            }
        }, 
        {
            "$addFields": {
                "avg_bid": {
                    "$avg": "$bids.bid_price"
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
            "$match": {
                "bids.username": {
                    $eq: msg.username
                }
            }
        }
    ];    

    // fetch relevant projects
    var promise = Project.aggregate(pipeline).exec();

    promise.then(function (data) {
        console.log("dashboard_bids.js data-");
        console.log(data);
        res.value = data;
        if (data) {
            res.code = 201;
        }else {
            res.code = 200;
        }
        callback(null, res);
    }).catch(function (err) {
        // just need one of these
        console.log('error:', err.message);
        res.code = '400';
        callback(err, res);
    });
}

exports.handle_request = handle_request;