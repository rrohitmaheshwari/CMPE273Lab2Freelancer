var express = require('express');
var router = express.Router();
//var mysql = require('./mysql');
var mysql = require('./mysql_without_connectionPool');
let fs = require('fs');
let path = require('path')
const bcrypt    = require('bcryptjs');
const multer = require('multer');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Freelancer Server'});
});

/* POST user authentication. */
router.post('/users/authenticate', function (req, res) {

    var getUser = "select user_id,username,email,name,summary,phone,about_me,skills,looking_for,password from users where username='" + req.body.username + "'";
    var username=req.body.username;

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.length > 0) {
                bcrypt.compare(req.body.password, results[0].password, function (err, resp) {
                    if (resp) {
                        // Passwords match
                        console.log("valid Login");
                        //Assigning the session
                        req.session.username = req.body.username;
                        res.status(200).send({user: results[0]});
                    } else {
                        // Passwords doesn't match
                        res.statusMessage="The email and password you entered did not match our records. Please double-check and try again.";
                        res.status(400).end();
                    }
                })
            }
            else {
                console.log("Invalid Login!");
                res.statusMessage = "The username and password you entered did not match our records. Please double-check and try again.";
                res.status(400).end();
            }
        }
    }, getUser);
});


/* POST user registration. */
router.post('/users/register', function(req,res) {
    console.log(req.body);
    // check user already exists
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {

            let insertQuery = "INSERT INTO `users` (`name`,`email`, `username`, `password`,`looking_for`) VALUES ('" + req.body.Name + "','" + req.body.Email + "', '" + req.body.username + "', '" + hash + "', '" + req.body.looking_for +"')";
            mysql.fetchData(function (err, results) {
                if (err) {
                    if(err.message.includes("for key 'username_UNIQUE'")) {
                        res.statusMessage = "This username already exists!";
                    }else if(err.message.includes("for key 'email_UNIQUE'")) {
                        res.statusMessage = "This email address is already in use!";
                    }
                    console.log("reject");
                    res.status(400).end();
                }
                else {
                    res.status(200).send({user:"User created successfully"});
                }
            }, insertQuery);
        })
    })

});



router.post('/getUser', function(req, res, next) {
    //  console.log("req:"+req);
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

/* POST user home details. */

router.post('/home/getdetails', function (req, res) {

    var sqlQuery = "SELECT *,count(user_projects_project_id) as bid_count from  (SELECT projects.project_id ,projects.emp_username,projects.title,projects.description,projects.budget_range,projects.skills_req, projects.status,DATE_FORMAT(projects.complete_by,'%d/%m/%Y') as niceDate,user_projects.project_id as user_projects_project_id from  freelancerdb.projects left join freelancerdb.user_projects ON projects.project_id = user_projects.project_id Where status=\"Open\" ) as complete_table WHERE emp_username<>'"+req.body.username+"' group by project_id";


    console.log("Requesting session User" + req.session.username);
   if (req.session.username) {
        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                if (results.length > 0) {
                    console.log("Fetch Successful!");
                    res.status(201).send({result: results});
                }
                else {
                    console.log("No data fetched!");
                    res.statusMessage = "No data fetched";
                    res.status(201).send({result: []});
                }
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

router.get('/project/getprojectdetails', function (req, res) {



    var sqlQuery = "SELECT name,project_id,emp_username,title,description,budget_range,skills_req,filenames,DATE_FORMAT(projects.complete_by,'%d-%m-%Y') as complete_by_shortdate from  projects inner join users on  projects.emp_username =  users.username where project_id='"+req.query.project_id+"';";


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



    var sqlQuery = "SELECT count(*) as bid_count, avg(bid_price) as average_bid FROM freelancerdb.user_projects where project_id='"+req.query.project_id+"';";



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


    console.log("req.body");
console.log(req.body);


var deleteQuery="DELETE FROM `freelancerdb`.`user_projects` WHERE `user_id`='"+req.body.data.user_id+"' AND `project_id`='"+req.body.data.project_id+"';"
    var insertQuery = "INSERT INTO `freelancerdb`.`user_projects` (`user_id`, `project_id`, `bid_price`, `days_req`) VALUES ('"+req.body.data.user_id+"', '"+req.body.data.project_id+"', '"+req.body.data.bid_price+"', '"+req.body.data.days_req+"');";
    console.log("Requesting session User>" + req.session.username);
    if (req.session.username) {


        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                console.log(deleteQuery);
                console.log("Fetch Deleted");
                res.statusMessage = "Data Deleted";

                mysql.fetchData(function (err, results) {
                    if (err) {
                        res.status(400).send("DB Fail");
                        throw err;

                    }
                    else {
                        console.log(insertQuery);
                        console.log("Updated Details Successful!");
                        res.statusMessage = "Data Updated";
                        res.status(200).send({result: results});

                    }
                }, insertQuery);

            }
        }, deleteQuery);




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

router.post('/project/post-project', function(req,res) {
    console.log(req.body);
    // check user already exists
    if(req.session.username) {
        let insertQuery = "INSERT INTO `projects` (`emp_username`, `title`, `description`, `budget_range`, `skills_req`, `status`, `complete_by`, `filenames`) VALUES ('"
            + req.session.username + "', '" + req.body.title + "', '" + req.body.description + "', '" + req.body.budget_range + "', '" + req.body.skills_req + "', '" + req.body.status + "', '" + req.body.complete_by + "', '" + req.body.filenames + ",')";
        mysql.fetchData(function (err, results) {
            if (err) {
                res.statusMessage = "Error in Posting project.";
                res.status(400).end();
            }
            else {
                //res.statusMessage = "Project Created successfully!";
                res.status(200).send({message:"Project Created successfully!"});
            }
        }, insertQuery);
    }else {
        res.statusMessage = "invalid session";
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


