var Transaction = require('../model/transaction');
var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    var myObj = new Transaction({
        from: msg.request.from,
        to: msg.request.to,
        type: msg.request.type,
        amount: msg.request.amount,
        Date: date + '-' + month + '-' + year,
        project: msg.request.project

    });


    var promise = myObj.save();

    promise
        .then(function (data) {
            console.log("data-")
            console.log(data)
            res.value = data;
            res.code = '200';

            if (msg.request.type === "Transfer") {
                Project.findOneAndUpdate(
                    {_id: msg.request.project},
                    {
                        $set: {
                            "status": 'Closed'
                        }
                    },
                    function (err, doc) {
                        if (err) {

                            res.code = "400";
                            res.value = "Cannot update at the moment";
                            console.log(res.value);
                            callback(err, res);
                        }
                        else {
                            callback(null, res);
                        }


                    }
                );
            }


            callback(null, res);
        })
        .catch(function (err) {
            console.log('error:', err.message);
            res.code = '400';
            callback(null, res);
        });
}

exports.handle_request = handle_request;