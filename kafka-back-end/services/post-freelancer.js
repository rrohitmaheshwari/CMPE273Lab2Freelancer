var Project = require('../model/Project');

function handle_request(msg, callback) {

    var res = {};
    console.log("In post-freelancer.js handle_request():");

    Project.findOneAndUpdate(
        { _id: msg.project_id },
        {
            $set: {
                "freelancer_username"   : msg.freelancer_username, 
                "status"                : 'Assigned'
            }
        },
        { new: true }, 
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