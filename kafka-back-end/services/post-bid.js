var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log("In post-bid.js handle_request():");

    Project.update(
        {_id: msg.project_id, "bids.username": msg.username}, 
        {$set:{"$bids":[{"$bids.bid_price":msg.bid_price, "$bids.days_req":msg.days_req, "$bids.name":msg.name, "$bids.username":msg.username}]}}, 
        { "upsert": true }, 
        function (err, doc) {
            if (err) {

                res.code = "400";
                res.value = "Cannot update Bid";
                console.log("###Error");
                console.log(err);
                callback(err, res);
            }

            res.code = "200";
            res.value = doc;
            console.log("###doc");         
            console.log(doc);
            callback(null, res);
        }
    );
}

exports.handle_request = handle_request;