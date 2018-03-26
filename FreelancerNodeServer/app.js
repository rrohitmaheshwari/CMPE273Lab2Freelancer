var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var cors = require('cors');

var session = require('client-sessions');
//var session = require('express-session');
//var mongoStore = require("connect-mongo/es5")(session);
//var mongoSessionURL = "mongodb://localhost:27017/sessions";

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));


app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://10.0.0.137:3000','http://10.0.0.188:3000'],
        credentials: true,
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookieName: 'session',
    resave: false,
    saveUninitialized: false,
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session 10 min
    activeDuration: 5 * 60 * 1000,
   // store: new mongoStore({url: mongoSessionURL})
})); // setting time for the session to be active when the window is open // 1/ minute set currently


app.use('/', index);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
