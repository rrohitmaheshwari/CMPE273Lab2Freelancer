var express = require('express');
var router = express.Router();
//var mysql = require('./mysql');
var mysql = require('./mysql_without_connectionPool');
let fs = require('fs');
let path = require('path')
const multer = require('multer');
var kafka = require('./kafka/client');

var passport = require('passport');
require('../routes/passport');

var nodemailer = require('nodemailer');
var currentPath = process.cwd();

console.log("currentPath");
console.log(currentPath);

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'do.not.reply.rohit@gmail.com',
        pass: 'Asdfg~!2017'
    }
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Freelancer Server'});
});


// Get current user details
router.post('/getUser', isAuthenticated, function (req, res, next) {
    //setting queue name and payload
    kafka.make_request('getUser_topic', {
            "username": req.session.username,
        }, function (err, results) {
            console.log('in /getUser result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Username does not exist. Please double-check and try again.";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    console.log('/getUser:: results.value');
                    console.log(results.value);

                    //success case
                    res.status(200).send({user: results.value});
                }
            }
        }
    );
});

/* POST user authentication/user login. */
router.post('/users/authenticate', function (req, res) {
    passport.authenticate('login', function (err, user) {
        if (err) {
            res.status(500).send();
        }

        if (!user) {
            res.statusMessage = "Username does not exist. Please double-check and try again.";
            res.status(400).send();
        }
        else {

            req.login(user.username, function (err) {
                if (err) {
                    console.log(err);
                }
                req.session.username = user.username;
                console.log(req);
                console.log("session initilized");
                res.status(200).send({user: user});

            });

        }

    })(req, res);


});


/* POST user registration. */
router.post('/users/register', function (req, res) {

    passport.authenticate('signup', function (err, user, results) {
        if (err) {
            res.status(500).send({user: "Server Error"});
        }
        if (user === false) {
            console.log("node index.js-");
            console.log(results);
            res.statusMessage = results.value;
            res.status(400).end();
        }
        else {
            res.status(200).send({user: "User created successfully"});
        }
    })(req, res);

});

/* POST PROJECT post request*/
router.post('/project/post-project', function (req, res) {


    if (req.session.username) {
        kafka.make_request('post-project_topic', {
            "request": req.body,
            "username": req.session.username
        }, function (err, results) {
            console.log('in post-project_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message: "Server Error!"});
            }
            else {
                console.log("Fetch Successful!");
                res.status(200).send({message: "Project Created successfully!"});

            }

        });

    }
    else {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(401).end();
    }

});



/* POST Submit request*/
router.post('/project/submit-project', function (req, res) {


    if (req.session.username) {
        kafka.make_request('submit-project_topic', {
            "request": req.body,
            "username": req.session.username
        }, function (err, results) {
            console.log('in submit-project_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message: "Server Error!"});
            }
            else {
                console.log("Fetch Successful!");
                res.status(200).send({message: "Project Submitted successfully!"});

            }

        });

    }
    else {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(401).end();
    }

});



/* POST Transaction request*/
router.post('/project/post-Transaction', function (req, res) {


    if (req.session.username) {
        kafka.make_request('transaction_topic', {
            "request": req.body,
            "username": req.session.username
        }, function (err, results) {
            console.log('transaction_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message: "Server Error,please try again!"});
            }
            else {
                console.log("Fetch Successful!");
                res.status(200).send({message: "Transaction successful!"});

            }

        });

    }
    else {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(401).end();
    }

});


/* POST home page Project details. */

router.post('/home/getdetails', function (req, res) {
    if (req.session.username) {
        kafka.make_request('home_project_topic', {"username": req.body.username}, function (err, results) {
            console.log('in home_project_topic');
            console.log(results);
            if (err) {

                console.log("err" + err);
                res.statusMessage = "Server error!";
                res.status(500).end();
            }
            else {
                if (results.code === 201) {
                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(201).send({result: results.value});

                }
                else {
                    console.log("No data fetched");
                    res.statusMessage = "No data fetched";
                    res.status(200).send({result: []});
                }
            }

        });

    }
    else {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();
    }

});


/* Profile update requests*/
function isAuthenticated(req, res, next) {

    // CHECK THE USER STORED IN SESSION
    console.log('###isAuthenticated called###');
    console.log('req.session.username' + req.session.username);

    if (req.session.username)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.statusMessage = "Session expired!";
    res.status(400).end();
}

router.post('/user/updateAboutMe', isAuthenticated, function (req, res) {
    console.log('###updateAboutMe called###');
    console.log(req.body);

    //setting queue name and payload
    kafka.make_request('updateAboutMe_topic', {
            "username": req.session.username,
            "about_me": req.body.about,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'About Me' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'About Me' successfully"});
                }
            }
        }
    );
});


router.post('/user/updateName', isAuthenticated, function (req, res) {
    console.log('###updateName called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('updateName_topic', {
            "username": req.session.username,
            "name": req.body.name,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'Name' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'Name' successfully"});
                }
            }
        }
    );
});


router.post('/project/getBidDetails', isAuthenticated, function (req, res) {


    console.log('###getBidDetails called###');
    console.log(req.body);

    //setting queue name and payload
    kafka.make_request('project_BidDetails', {
            "username": req.session.username,
            "project_id": req.body.project_id
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot fetch Bids at the moment";
                res.status(400).end();
            } else {
                if (results.code === 200) {
                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(200).send({result: results.value});
                }
            }
        }
    );
});

router.post('/getUser', function (req, res, next) {

    console.log("req.session.username:" + req.session.username);
    if (req.session.username) {
        var getUser = "select * from users where username='" + req.session.username + "'";
        console.log("Query is:" + getUser);
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                if (results.length > 0) {
                    console.log("valid Login");
                    console.log("results[0]:" + results[0]);
                    //Assigning the session
                    res.status(200).send({user: results[0]});
                }
                else {
                    console.log("Invalid Login");
                    res.statusMessage = "Username does not exist. Please double-check and try again.";
                    res.status(400).end();
                }
            }
        }, getUser);
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});


/* GET bid Project details. */
router.get('/project/getprojectdetails', function (req, res) {

    console.log(req.body);
    kafka.make_request('project_details', {
            "username": req.session.username,
            "project_id": req.query.project_id
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot fetch Projects at the moment";
                res.status(400).end();
            } else {
                if (results.code === 200) {
                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(200).send({result: results.value});
                }
            }
        }
    );
});


router.get('/project/getMyProjectDetails', function (req, res) {


    console.log('###getMyProjectDetails called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('dashboard_project_topic', {
            "username": req.session.username,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot fetch Projects at the moment";
                res.status(400).end();
            } else {
                if (results.code === 201) {
                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(201).send({result: results.value});
                }
                else {
                    console.log("No data fetched");
                    res.statusMessage = "No data fetched";
                    res.status(200).send({result: []});
                }
            }
        }
    );

});




router.get('/project/getMyTransactionDetails', function (req, res) {


    console.log('###getMyTransactionDetails called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('transaction-details_topic', {
            "username": req.session.username,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot fetch Transactions at the moment";
                res.status(400).end();
            } else {

                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(201).send({result: results.value});

            }
        }
    );

});


router.get('/project/getMyBidDetails', isAuthenticated, function (req, res) {

    console.log('###getMyBidDetails called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('dashboard_project_bids', {
            "username": req.session.username,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot fetch bids at the moment";
                res.status(400).end();
            } else {
                if (results.code === 201) {
                    console.log("Fetch Successful!");
                    console.log(results.value);
                    res.status(201).send({result: results.value});
                }
                else {
                    console.log("No data fetched");
                    res.statusMessage = "No data fetched";
                    res.status(200).send({result: []});
                }
            }
        }
    );
});

router.get('/project/getbidheader', function (req, res) {

    if (req.session.username) {
        kafka.make_request('bid_header_topic', {"request": req.query.project_id}, function (err, results) {
            console.log('in bid_header_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message: "Server Error!"});
            }
            else {
                console.log("Fetch Project Details Successful!");
                res.statusMessage = "Data fetched";
                res.status(200).send({result: results.value});

            }

        });

    }
    else {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();
    }


});
//
// router.post('/project/getdetails', function (req, res) {
//
//
//     var sqlQuery="SELECT id,users.user_id,project_id,bid_price,days_req,username,name from  freelancerdb.user_projects left join  freelancerdb.users  on users.user_id = user_projects.user_id  where project_id='"+req.body.project_id+"'";
//     console.log("Requesting session User>" + req.session.username);
//     if (req.session.username) {
//         mysql.fetchData(function (err, results) {
//             if (err) {
//                 throw err;
//             }
//             else {
//
//                     console.log("Fetch Project Details Successful!");
//                     res.statusMessage = "Data fetched";
//                     res.status(200).send({result: results});
//
//             }
//         }, sqlQuery);
//     }
//     else
//     {
//         console.log("Session expired!");
//         res.statusMessage = "Session expired!";
//         res.status(400).end();
//
//     }
//
// });

router.post('/project/postFreelancer', isAuthenticated, function (req, res) {

    kafka.make_request('post-freelancer_topic', {
            "username": req.session.username,
            "freelancer_username": req.body.data.freelancer_username,
            "project_id": req.body.data.project_id
        }, function (err, results) {
            console.log('postFreelancer');

        console.log(results.value.email);

        var mailOptions = {
            from: 'do.not.reply.rohit@gmail.com',
            to: results.value.email,   //change it to actual email id
            bcc: 'rrohit.maheshwari@gmail.com',
            subject: 'You have been hired',
            text: 'Go to your Freelancer account for more details!\nProjectID: ' + req.body.data.project_id,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        if (err) {
                //failure case
                res.statusMessage = "Error in Hiring Freelancer at the moment. Try again later.";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({message: "Hired freelancer successfully"});
                }
            }
        }
    );



});


router.post('/project/postbiddata', isAuthenticated, function (req, res) {


    console.log(req.body);

    //setting queue name and payload
    kafka.make_request('post-bid_topic', {
            "username": req.session.username,
            "name": req.body.data.name,
            "project_id": req.body.data.project_id,
            "bid_price": req.body.data.bid_price,
            "days_req": req.body.data.days_req,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Error in Posting bid.";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({message: "Bid Posted successfully"});
                }
            }
        }
    );
});


router.post('/user/logout', function (req, res) {


    console.log("req.session.username:" + req.session.username);
    if (req.session.username) {
        req.logout();
        req.session.destroy();
        console.log("Session Destroyed!-" + req.session.username);
        res.status(200).send({message: "Logout"});
    } else {
        console.log("Session not found/already destroyed!");
        res.status(200).send({message: "Logout"});
    }

});


router.post('/getProfileImg', function (req, res, next) {
    if (req.session.username) {
        fs.readFile('/public/ProfileImage/' + req.body.username + '.jpg', function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type': 'text/html'})
                console.log(err);
                res.end("No such image");
            } else {
                //specify the content type in the response will be an image
                let base64Image = new Buffer(content, 'binary').toString('base64');

                console.log("###image in node");
                //convert image file to base64-encoded string
                res.status(200).send({img: base64Image});
                // res.end({img : base64Image});
            }
        });
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});



router.post('/getOtherUser', isAuthenticated,function (req, res, next) {
    //  console.log("req:"+req);
    kafka.make_request('getUser_topic', {
            "username": req.body.username,
        }, function (err, results) {
            console.log('in /getUser result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Username does not exist. Please double-check and try again.";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    console.log('/getUser:: results.value');
                    console.log(results.value);

                    //success case
                    res.status(200).send({user: results.value});
                }
            }
        }
    );
});

// User profile update 'About Me' request
router.post('/user/updateAboutMe', isAuthenticated, function (req, res) {

    console.log('###updateAboutMe called###');
    console.log(req.body);

    //setting queue name and payload
    kafka.make_request('updateAboutMe_topic', {
            "username": req.session.username,
            "about_me": req.body.about,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'About Me' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'About Me' successfully"});
                }
            }
        }
    );
});

// User profile update 'Name' request
router.post('/user/updateName', isAuthenticated, function (req, res) {

    console.log('###updateName called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('updateName_topic', {
            "username": req.session.username,
            "name": req.body.name,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'Name' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'Name' successfully"});
                }
            }
        }
    );
});

// User profile update 'Phone' request
router.post('/user/updatePhone', isAuthenticated, function (req, res) {

    console.log('###updatePhone called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('updatePhone_topic', {
            "username": req.session.username,
            "phone": req.body.phone,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'Phone' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'Phone' successfully"});
                }
            }
        }
    );
});

// User profile update 'Summary' request
router.post('/user/updateSummary', isAuthenticated, function (req, res) {

    console.log('###updateSummary called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('updateSummary_topic', {
            "username": req.session.username,
            "summary": req.body.summary,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'Summary' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'Summary' successfully"});
                }
            }
        }
    );
});

// User profile update 'Skills' request
router.post('/user/updateSkills', isAuthenticated, function (req, res) {

    console.log('###updateSkills called###');
    console.log(req.body);
    //setting queue name and payload
    kafka.make_request('updateSkills_topic', {
            "username": req.session.username,
            "skills": req.body.skills,
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                //failure case
                res.statusMessage = "Cannot set 'Skills' at the moment";
                res.status(400).end();
            } else {
                if (results.code == 200) {
                    //success case
                    res.status(200).send({about: "Updated 'Skills' successfully"});
                }
            }
        }
    );
});


var storageProjFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, createDirectory(req.session.username));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var rootDirectory = currentPath+"/public/project_files/";

var uploadProjFiles = multer({
    storage: storageProjFiles
});

function createDirectory(username) {
    if (!fs.existsSync(rootDirectory)) {
        fs.mkdirSync(rootDirectory);
    }
    let directory = rootDirectory + username;
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    return directory;
}

router.post('/project/upload-files', uploadProjFiles.any(), function (req, res, next) {
    console.log('###/saveProfile');
    console.log(req.session.username);
    console.log(req.body);
    if (req.session.username) {
        console.log(req.body, 'Body');
        // console.log(req.files, 'files');
        res.status(200).send({result: "File is uploaded"});
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/ProfileImage/');
    },
    filename: function (req, file, cb) {
        filename = req.session.username + path.extname(file.originalname);
        cb(null, filename);
    }
});
var upload = multer({
    storage: storage
});

router.post('/saveProfile', upload.any(), function (req, res, next) {
    console.log('###/saveProfile');
    console.log(req.session.username);
    console.log(req.body);
    if (req.session.username) {
        console.log(req.body, 'Body');
        // console.log(req.files, 'files');
        res.status(200).send({result: "File is uploaded"});
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});


module.exports = router;


