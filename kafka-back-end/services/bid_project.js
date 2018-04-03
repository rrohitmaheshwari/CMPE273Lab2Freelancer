var Bids = require('../model/Bids');


function handle_request(msg, callback) {

    var res = {};
    console.log("In handle request:" + JSON.stringify(msg));

    res.value = msg;
    res.code = 200;

    var myObj = new Bids({
        user_id: msg.request.user_id,
        project_id: msg.request.project_id,
        bid_price: msg.request.bid_price,
        days_req: msg.request.days_req,
    });


    var promise_delete = Bids.remove({user_id:msg.request.user_id,project_id:msg.request.project_id});


    promise_delete.then(function (result) {

        var promise = myObj.save();

        promise.then(function (data) {
            console.log("data-")
            console.log(data)
            res.value = data;
            res.code = '200';
            callback(null, res);

        })
            .catch(function (err) {
                // just need one of these
                console.log('error:', err.message);
                res.code = '400';
                callback(null, res);
            });
    })


        .catch(function (err) {
            // just need one of these
            console.log('error:', err.message);
            res.code = '400';
            callback(null, res);
        });


}


exports.handle_request = handle_request;