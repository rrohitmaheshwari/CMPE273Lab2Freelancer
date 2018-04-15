var connection = require('./kafka/Connection');
var mongoose = require('mongoose');

var signup = require('./services/signup');
var login = require('./services/login');
var post_project = require('./services/post_project');
var getUser = require('./services/getUser');
var updateAboutMe = require('./services/updateAboutMe');
var updateName = require('./services/updateName');
var updatePhone = require('./services/updatePhone');
var updateSummary = require('./services/updateSummary');
var updateSkills = require('./services/updateSkills');
var home_project = require('./services/home_project');
var dashboard_project = require('./services/dashboard_project');
var dashboard_bids = require('./services/dashboard_bids');
var project_details = require('./services/project_details');
var project_BidDetails = require('./services/project_BidDetails');
var post_bid = require('./services/post-bid');
var post_freelancer     = require('./services/post-freelancer');
var submit_project     = require('./services/submit_project');
var transaction     = require('./services/transaction');
var transaction_details     = require('./services/transaction_details');

var producer = connection.getProducer();


var consumer_signup = connection.getConsumer('signup_topic');
var consumer_login = connection.getConsumer('login_topic');
var consumer_post_project = connection.getConsumer('post-project_topic');
var consumer_getUser = connection.getConsumer('getUser_topic');
var consumer_updateAboutMe = connection.getConsumer('updateAboutMe_topic');
var consumer_updateName = connection.getConsumer('updateName_topic');
var consumer_updatePhone = connection.getConsumer('updatePhone_topic');
var consumer_updateSummary = connection.getConsumer('updateSummary_topic');
var consumer_updateSkills = connection.getConsumer('updateSkills_topic');
var consumer_home_project = connection.getConsumer('home_project_topic');
var consumer_dashboard_project = connection.getConsumer('dashboard_project_topic');
var consumer_dashboard_bids = connection.getConsumer('dashboard_project_bids');
var consumer_project_details = connection.getConsumer('project_details');
var consumer_project_BidDetails = connection.getConsumer('project_BidDetails');
var consumer_post_bid = connection.getConsumer('post-bid_topic');
var consumer_post_freelancer    = connection.getConsumer('post-freelancer_topic');
var consumer_submit_project    = connection.getConsumer('submit-project_topic');
var consumer_transaction    = connection.getConsumer('transaction_topic');
var consumer_transaction_details    = connection.getConsumer('transaction-details_topic');



// native promises

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log("Connection Successful!");
});

consumer_signup.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    signup.handle_request(data.data, function (err, res) {
        console.log('after handle' + res);
        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: res
                }),
                partition: 0
            }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        return;
    });
});



consumer_post_project.on('message', function (message) {
    console.log('consumer_post_project message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    post_project.handle_request(data.data, function (err, res) {
        console.log('after handle consumer_post_project' + res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        return;
    });
});


consumer_getUser.on('message', function (message) {
    console.log('consumer_getUser message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    getUser.handle_request(data.data, function (err, res) {
        console.log('after handle consumer_getUser' + res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        return;
    });
});

consumer_home_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    home_project.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_updateAboutMe.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    updateAboutMe.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_updateName.on('message', function (message) {
    console.log('updateName message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    updateName.handle_request(data.data, function (err, res) {
        console.log('updateName after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("updateName data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_updatePhone.on('message', function (message) {
    console.log('updatePhone message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    updatePhone.handle_request(data.data, function (err, res) {
        console.log('updatePhone after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("updatePhone data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_updateSummary.on('message', function (message) {
    console.log('updateSummary message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    updateSummary.handle_request(data.data, function (err, res) {
        console.log('updateSummary after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("updateSummary data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_updateSkills.on('message', function (message) {
    console.log('updateSkills message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    updateSkills.handle_request(data.data, function (err, res) {
        console.log('updateSkills after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("updateSkills data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_dashboard_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    dashboard_project.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_dashboard_bids.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    dashboard_bids.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_project_details.on('message', function (message) {
    console.log('message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    project_details.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_project_BidDetails.on('message', function (message) {
    console.log('message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    project_BidDetails.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_post_bid.on('message', function (message) {
    console.log('message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    post_bid.handle_request(data.data, function (err, res) {
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log("data from kafka-");
            console.log(payloads);
        });
        return;
    });
});

consumer_post_freelancer.on('message', function (message) {
    console.log('message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    post_freelancer.handle_request(data.data, function(err,res){
        console.log('after handle-');
        console.log(res);
        var payloads = [{
            topic: data.replyTo,
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



consumer_login.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function (err, res) {
        console.log('after handle' + res);
        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: res
                }),
                partition: 0
            }
        ];
        producer.send(payloads, function (err, data) {
            console.log("Logged In");
            console.log( payloads);
            console.log(data);
        });
        return;
    });
});


consumer_submit_project.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    submit_project.handle_request(data.data, function (err, res) {
        console.log('after handle' + res);
        var payloads = [
            {
                topic: data.replyTo,
                messages: JSON.stringify({
                    correlationId: data.correlationId,
                    data: res
                }),
                partition: 0
            }
        ];
        producer.send(payloads, function (err, data) {
            console.log("Logged In");
            console.log( payloads);
            console.log(data);
        });
        return;
    });
});



consumer_transaction.on('message', function (message) {
    console.log('consumer_transaction message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    transaction.handle_request(data.data, function (err, res) {
        console.log('after handle consumer_transaction' + res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        return;
    });
});



consumer_transaction_details.on('message', function (message) {
    console.log('consumer_transaction message received');
    console.log(message.value);
    var data = JSON.parse(message.value);
    transaction_details.handle_request(data.data, function (err, res) {
        console.log('after handle consumer_transaction' + res);
        var payloads = [{
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
        ];
        producer.send(payloads, function (err, data) {
            console.log(data);
        });
        return;
    });
});
