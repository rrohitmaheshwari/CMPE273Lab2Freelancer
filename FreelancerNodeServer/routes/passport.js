var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


//var mongoURL = "mongodb://localhost:27017/dropbox";
var kafka = require('./kafka/client');

module.exports = passport.use('login', new LocalStrategy(function (username, password, done) {
    console.log('in password');
    kafka.make_request('login_topic', {"username": username, "password": password}, function (err, results) {
        console.log('in result');
      //  console.log(results);
        if (err) {
            done(err, {});
        }
        else {
            if (results.code == 200) {
                done(null, {username: username, password: password, name: results.value.name, email: results.value.email});
            }
            else {
                done(null, false);
            }
        }
    });
}));

module.exports = passport.use('signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {
        console.log("Inside Signup");


        //setting queue name and payload
        kafka.make_request('signup_topic', {
            "username": username,
            "password": password,
            "name": req.body.Name,
            "email": req.body.Email,
            "looking_for": req.body.looking_for
        }, function (err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                done(err, {});
            }
            else {
                if (results.code == 200) {

                    done(null, true,results);
                }
                else {
                    done(null, false,results);
                }
            }
        });
    }));




// Delay the execution of findOrCreateUser and execute
// the method in the next tick of the event loop
	    