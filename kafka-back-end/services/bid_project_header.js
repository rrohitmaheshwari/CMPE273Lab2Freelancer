var Bids = require('../model/Bids');


function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    res.value = msg;
    res.code = 200;



    var promise= Bids.aggregate([{ $match: {project_id:msg.request}},
        {
            $group: {
                _id: null,

                bid_count: {
                    $sum: 1
                },
                average_bid:
                    {
                        $avg: "$bid_price"
                    },
            }}]);


    promise.then(function (result) {

        console.log("data**-")
        console.log(result)
        res.value = result;
        res.code = '200';
        callback(null, res);
    })


        .catch(function (err) {
            // just need one of these
            console.log('error:', err.message);
            res.code = '400';
            callback(null, res);
        });


}


exports.handle_request = handle_request;