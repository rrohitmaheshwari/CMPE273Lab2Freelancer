var Project = require('../model/Project');
var User = require('../model/user');

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


            User.findOne({username: msg.freelancer_username}, function (err, user) {
                if (err) {

                    res.code = "400";
                    res.value = "Cannot find freelancer at the moment";
                    console.log("#######");
                    console.log(res.value);
                    callback(err, res);
                }

                res.code = "200";
                res.value = user;
                console.log("**********");
                console.log(user);
                callback(null, res);
            })


        }
    );
}

exports.handle_request = handle_request;