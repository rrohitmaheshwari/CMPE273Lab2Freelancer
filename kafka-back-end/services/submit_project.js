var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log(msg);

    Project.findOneAndUpdate(
        {_id: msg.request.id},
        {
            $set: {
                "freelancer_files": msg.request.filenames+",",
                "status": 'Submitted'
            }
        },

        function (err, doc) {
            if (err) {

                res.code = "400";
                res.value = "Cannot set freelancer at the moment";
                console.log(res.value);
                callback(err, res);
            }


            res.code = "200";
            res.value = doc;

            console.log(doc);
            callback(null, res);


        }
    );

}

exports.handle_request = handle_request;