var connection =  new require('./kafka/Connection');
var signup = require('./services/signup');
var login = require('./services/login');
var post_project = require('./services/post_project');
var home_project = require('./services/home_project');
var get_project_details = require('./services/get_project_details');
var bid_project= require('./services/bid_project');
var bid_project_header= require('./services/bid_project_header');



var consumer_signup = connection.getConsumer('signup_topic');
var consumer_login = connection.getConsumer('login_topic');
var consumer_home_project = connection.getConsumer('home_project_topic');
var consumer_create_project = connection.getConsumer('create_project_topic');
var consumer_get_project_details = connection.getConsumer('get_project_details_topic');
var consumer_bid_project = connection.getConsumer('bid_project_topic');
var consumer_bid_header = connection.getConsumer('bid_header_topic');

var producer = connection.getProducer();


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/freelancer');

// native promises
mongoose.Promise = global.Promise;


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connection Successful!");
});


consumer_signup.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    signup.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


consumer_login.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});



consumer_home_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    home_project.handle_request(data.data, function(err,res){
        console.log('after handle-');
        console.log(res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});




consumer_create_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    post_project.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

consumer_get_project_details.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    get_project_details.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


consumer_bid_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    bid_project.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


consumer_bid_header.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    bid_project_header.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});
