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


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Freelancer Server'});
});

/* POST user authentication/user login. */
router.post('/users/authenticate', function (req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(400).send();
        }
        else {
            req.session.username = user.username;
            console.log(user);
            console.log("session initilized");
            res.status(200).send({user:user});
        }
    })(req,res);
});


/* POST user registration. */
router.post('/users/register', function(req,res) {

    passport.authenticate('signup', function(err,user,results){
        if(err){
            res.status(500).send({user:"Server Error"});
        }
        if(user === false){
            console.log("node index.js-");
            console.log(results);
            res.statusMessage = results.value;
            res.status(400).end();
        }
        else {
            res.status(200).send({user:"User created successfully"});
        }
    })(req,res);

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
    else
    {
             console.log("Session expired!");
            res.statusMessage = "Session expired!";
            res.status(400).end();
    }

});



router.post('/getUser', function(req, res, next) {

    console.log("req.session.username:"+req.session.username);
    if(req.session.username) {
        var getUser = "select * from users where username='" + req.session.username + "'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err){
                throw err;
            }
            else {
                if(results.length > 0){
                    console.log("valid Login");
                    console.log("results[0]:"+results[0]);
                    //Assigning the session
                    res.status(200).send({user : results[0]});
                }
                else {
                    console.log("Invalid Login");
                    res.statusMessage = "Username does not exist. Please double-check and try again.";
                    res.status(400).end();
                }
            }
        },getUser);
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});


/* GET bid Project details. */
router.get('/project/getprojectdetails', function (req, res) {

    console.log(req.body);
    if (req.session.username) {
        kafka.make_request('get_project_details_topic', {"request": req.query.project_id}, function (err, results) {
            console.log('in get_project_details_topic');
            console.log(results);
            if (err) {

                console.log("err" + err);
                res.statusMessage = "Server error!";
                res.status(500).end();
            }
            else {

                    console.log("Fetch Successful!!!");
                    console.log(results.value);
                    var newObj=[{

                emp_username: results.value[0].emp_username,
                    title: results.value[0].title,
                    description: results.value[0].description,
                    budget_range: results.value[0].budget_range,
                    skills_req: results.value[0].skills_req,
                    complete_by_shortdate: results.value[0].complete_by,
                    filenames: results.value[0].filenames,
                    project_id: results.value[0].project_id,

                    }];
                console.log(newObj);

            res.status(200).send({result: newObj});
            }

        });

    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();
    }


});



router.get('/project/getMyProjectDetails', function (req, res) {



    var sqlQuery = "SELECT projects.project_id,title,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate,status,freelancer_username,table2.avg_bid FROM freelancerdb.projects left join (SELECT project_id,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as table2 on  projects.project_id=table2.project_id  where emp_username='"+req.query.username+"' order by status desc;";


    console.log("Requesting session User->" + req.session.username);
    if (req.session.username) {
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Fetch Project Details Successful!");
                res.statusMessage = "Data fetched";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();

    }

});





router.get('/project/getMyBidDetails', function (req, res) {



    var sqlQuery = "SELECT * from projects inner join (SELECT * FROM freelancerdb.user_projects inner join (SELECT project_id as table_bid_pid,avg(bid_price) as avg_bid FROM freelancerdb.user_projects group by project_id) as user_projects_avg  on user_projects.project_id=user_projects_avg.table_bid_pid where user_id='"+req.query.user_id+"') as table_bid on projects.project_id=table_bid.table_bid_pid order by status desc;";
    console.log(sqlQuery);

    console.log("Requesting session User->" + req.session.username);
    if (req.session.username) {
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Fetch Bid Details Successful!");
                res.statusMessage = "Data fetched";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();

    }

});

router.get('/project/getbidheader', function (req, res) {

    if (req.session.username) {
        kafka.make_request('bid_header_topic', {"request": req.query.project_id}, function (err, results) {
            console.log('in bid_header_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message:"Server Error!"});
            }
            else {
                console.log("Fetch Project Details Successful!");
                res.statusMessage = "Data fetched";
                res.status(200).send({result: results.value});

            }

        });

    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();
    }


});

router.post('/project/getdetails', function (req, res) {


    var sqlQuery="SELECT id,users.user_id,project_id,bid_price,days_req,username,name from  freelancerdb.user_projects left join  freelancerdb.users  on users.user_id = user_projects.user_id  where project_id='"+req.body.project_id+"'";
    console.log("Requesting session User>" + req.session.username);
    if (req.session.username) {
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                    console.log("Fetch Project Details Successful!");
                    res.statusMessage = "Data fetched";
                    res.status(200).send({result: results});

            }
        }, sqlQuery);
    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();

    }

});



router.post('/project/postFreelancer', function (req, res) {


    var sqlQuery="UPDATE `freelancerdb`.`projects` SET `status`='Assigned',`freelancer_username`='"+req.body.data.freelancer_username+"' WHERE `project_id`='"+req.body.data.project_id+"';";
    console.log("Query->" , sqlQuery);
    console.log("Requesting session User>" + req.session.username);
    if (req.session.username) {
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {

                console.log("Fetch Project Details Successful!");
                res.statusMessage = "Data Updated";
                res.status(200).send({result: results});

            }
        }, sqlQuery);
    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();

    }

});



router.post('/project/postbiddata', function (req, res) {

//
// console.log("req.body");
// console.log(req.body);
//
// var deleteQuery="DELETE FROM `freelancerdb`.`user_projects` WHERE `user_id`='"+req.body.data.user_id+"' AND `project_id`='"+req.body.data.project_id+"';"
//     var insertQuery = "INSERT INTO `freelancerdb`.`user_projects` (`user_id`, `project_id`, `bid_price`, `days_req`) VALUES ('"+req.body.data.user_id+"', '"+req.body.data.project_id+"', '"+req.body.data.bid_price+"', '"+req.body.data.days_req+"');";
//     console.log("Requesting session User>" + req.session.username);
//     if (req.session.username) {
//
//         mysql.fetchData(function (err, results) {
//             if (err) {
//                 throw err;
//             }
//             else {
//                 console.log(deleteQuery);
//                 console.log("Fetch Deleted");
//                 res.statusMessage = "Data Deleted";
//
//                 mysql.fetchData(function (err, results) {
//                     if (err) {
//                         res.status(400).send("DB Fail");
//                         throw err;
//
//                     }
//                     else {
//                         console.log(insertQuery);
//                         console.log("Updated Details Successful!");
//                         res.statusMessage = "Data Updated";
//                         res.status(200).send({result: results});
//
//                     }
//                 }, insertQuery);
//
//             }
//         }, deleteQuery);
//
//
//
//
//     }
//     else
//     {
//         console.log("Session expired!");
//         res.statusMessage = "Session expired!";
//         res.status(400).end();
//
//     }



    if (req.session.username) {
        kafka.make_request('bid_project_topic', {"request": req.body.data,"username":req.session.username}, function (err, results) {
            console.log('in bid_project_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(400).send("Kafka/DB Fail");
            }
            else {
                console.log("Updated Details Successful!");
                res.statusMessage = "Data Updated";
                res.status(200).send({result: results});

            }

        });

    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(400).end();
    }

});





router.post('/user/logout', function (req, res) {



    console.log("req.session.username:" + req.session.username);
    if(req.session.username) {
        req.session.destroy();
        console.log("Session Destroyed!");
        res.status(200).send({ message: "Logout" });
    } else {
        console.log("Session not found/already destroyed!");
        res.status(200).send({ message: "Logout" });
    }

});



router.post('/getProfileImg', function(req, res, next) {
    if(req.session.username) {
        fs.readFile('/Users/rohit/Documents/GitHub/CMPE273/CMPE273Lab1Freelancer/FreelancerNodeServer/public/ProfileImage/' + req.body.username + '.jpg', function (err, content) {
            console.log("###img:", content);
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


router.post('/getOtherUser', function(req, res, next) {
    //  console.log("req:"+req);
    console.log("req.session.username:"+req.session.username);
    if(req.session.username) {
        var getUser = "select * from users where username='" + req.body.username + "'";
        console.log("Query is:"+getUser);
        mysql.fetchData(function(err,results){
            if(err){
                throw err;
            }
            else {
                if(results.length > 0){
                    console.log("valid Login");
                    console.log("results:"+results);
                    console.log("results[0]:"+results[0]);
                    // //Assigning the session
                    res.status(200).send({user : results[0]});
                }
                else {
                    console.log("Invalid Login");
                    res.statusMessage = "Username does not exist. Please double-check and try again.";
                    res.status(400).end();
                }
            }
        },getUser);
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});

router.post('/user/updateAboutMe', function(req,res) {
    console.log(req.body);
    // check user already exists
    let updateQuery = "UPDATE `users` SET `about_me`='" + req.body.about +"' WHERE `username`='" + req.session.username + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            res.statusMessage = "Cannot set 'About Me' at the moment";
            res.status(400).end();
        } else {
            res.status(200).send({about:"Updated 'About Me' successfully"});
        }
    }, updateQuery);
});


router.post('/user/updateSummary', function(req,res) {
    console.log(req.body);
    // check user already exists
    let updateQuery = "UPDATE `users` SET `summary`='" + req.body.summary +"' WHERE `username`='" + req.session.username + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            res.statusMessage = "Cannot set 'Summary' at the moment";
            res.status(400).end();
        }
        else {
            res.status(200).send({about:"Updated 'Summary' successfully"});
        }
    }, updateQuery);
});

router.post('/user/updateSkills', function(req,res) {
    console.log(req.body);
    // check user already exists
    let updateQuery = "UPDATE `users` SET `skills`='" + req.body.skills +"' WHERE `username`='" + req.session.username + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            res.statusMessage = "Cannot set 'Skills' at the moment";
            res.status(400).end();
        } else {
            res.status(200).send({about:"Updated 'Skills' successfully"});
        }
    }, updateQuery);
});

router.post('/user/updatePhone', function(req,res) {
    console.log(req.body);
    // check user already exists
    let updateQuery = "UPDATE `users` SET `phone`='" + req.body.phone +"' WHERE `username`='" + req.session.username + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            res.statusMessage = "Cannot set 'Phone' at the moment";
            res.status(400).end();
        } else {
            res.status(200).send({about:"Updated 'Phone' successfully"});
        }
    }, updateQuery);
});

router.post('/user/updateName', function(req,res) {
    console.log(req.body);
    // check user already exists
    let updateQuery = "UPDATE `users` SET `name`='" + req.body.name +"' WHERE `username`='" + req.session.username + "'";
    mysql.fetchData(function (err, results) {
        if (err) {
            res.statusMessage = "Cannot set 'Name' at the moment";
            res.status(400).end();
        } else {
            res.status(200).send({about:"Updated 'Name' successfully"});
        }
    }, updateQuery);
});


/* POST PROJECT post request*/
router.post('/project/post-project', function(req,res) {



    if (req.session.username) {
       kafka.make_request('create_project_topic', {"request": req.body,"username":req.session.username}, function (err, results) {
            console.log('in create_project_topic');
            console.log(results);
            if (err) {
                console.log("err" + err);
                res.status(500).send({message:"Server Error!"});
            }
            else {
                    console.log("Fetch Successful!");
                    res.status(200).send({message:"Project Created successfully!"});

            }

        });

    }
    else
    {
        console.log("Session expired!");
        res.statusMessage = "Session expired!";
        res.status(401).end();
    }

});



var storageProjFiles = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, createDirectory(req.session.username));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var rootDirectory = "public/project_files/";

var uploadProjFiles = multer({
    storage : storageProjFiles
});

function createDirectory(username) {
    if (!fs.existsSync(rootDirectory)){
        fs.mkdirSync(rootDirectory);
    }
    let directory = rootDirectory + username;
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    return directory;
}

router.post('/project/upload-files', uploadProjFiles.any(), function(req, res, next) {
    console.log('###/saveProfile');
    console.log(req.session.username);
    console.log(req.body);
    if(req.session.username) {
        console.log(req.body, 'Body');
        // console.log(req.files, 'files');
        res.status(200).send({result:"File is uploaded"});
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

router.post('/saveProfile', upload.any(), function(req, res, next) {
    console.log('###/saveProfile');
    console.log(req.session.username);
    console.log(req.body);
    if(req.session.username) {
        console.log(req.body, 'Body');
        // console.log(req.files, 'files');
        res.status(200).send({result:"File is uploaded"});
    } else {
        res.statusMessage = "invalid session";
        res.status(401).end();
    }
});


module.exports = router;


