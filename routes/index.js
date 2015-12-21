var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../model/dbModel').user;
var Resume = require('../model/dbModel').resume;
var emailExistence = require('email-existence');
var aws = require('aws-sdk');
var uuid = require('node-uuid');
var redisClient = require('../model/dbModel').redisClient;
var tokenAuth = require('../middleware/tokenAuth');


var tokenExpire = 60 * 60 * 24;
var actionExpire = 60 * 15;

aws.config.loadFromPath('./config/awsconfig.json');

// Instantiate SES, SQS.
var ses = new aws.SES();
var sqs = new aws.SQS();

var emailParams = {
    Destination: {ToAddresses: []},
    Message: {Body: {Text: {Data: ''}}, Subject: {Data: ''}},
    Source: 'jingxiaogu1992@gmail.com'
};

var sendMail = function(emailParams) {
    ses.sendEmail(emailParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
    });
};


var sqsCreateParams = {
    QueueName: ""
};

var createQueue = function (sqsCreateParams) {
    sqs.createQueue(sqsCreateParams, function (err, data) {
        if (err) throw err;
    });
};



var sendMessageToQueue = function (sqsGetParams, sqsSendParams, reviewee_name, subject, link) {
    sqs.getQueueUrl(sqsGetParams, function(err, data) {
        if (err) throw err;
        sqsSendParams.QueueUrl = data.QueueUrl;
        var obj = {
            "from": reviewee_name,
            "subject": subject,
            "link": link
        };
        sqsSendParams.MessageBody = JSON.stringify(obj);
        sqs.sendMessage(sqsSendParams, function (err, data) {
            if (err) throw err;
        });
    });
};

/************************* Home Page *******************************/

router.get('/verify', function (req, res, next) {
    var token = req.query.token;
    redisClient.get(token, function(err, reply) {
        if (reply) {
            User.update({uid: reply}, {$set:{status: 1}}, function(err, result) {
                if (err) res.send("internal err");
                else {
                    sqsCreateParams.QueueName = reply;
                    createQueue(sqsCreateParams);
                    res.send("Your account has been activated");
                    redisClient.del(token, function(err, res) {
                        if (err) console.log(err);
                    });
                }
            });
        }
        else {
            res.send("verification token has expired, please click the resend confirmation button");
        }
    });
});

router.get('/', function(req, res, next) {
    res.render("home_page");
});

router.post('/register', function(req, res, next) {
    emailExistence.check(req.body.email, function(err, truth){
        if (truth) {
            var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            var uid = uuid.v1();
            var record = new User({
                username: req.body.username,
                firstname: '',
                lastname: '',
                uid: uid,
                email: req.body.email,
                password: hash,
                status: 0,
                company: '',
                interested_field: [],
                avatar: {url: "https://s3.amazonaws.com/reshare%2Favatar/default-profile.png", aid: uuid.v1()}
            });
            var token = uuid.v1();
            console.log('regis uid: ' + uid);
            redisClient.set(token, uid);
            redisClient.expire(token, tokenExpire);//token will expire after 24 hours
            record.save(function(err) {
                if (err) {
                    var error = 'DB internal error';
                    if (err.code == 11000) {
                        error = 'This email is already taken, please try another.';
                    }
                    res.send({"success":false,"message":"ok","data":error});
                }
                else {
                    emailParams.Message.Subject.Data = 'Activate Your Account';
                    emailParams.Destination.ToAddresses.push(req.body.email);
                    emailParams.Message.Body.Text.Data =
                        'Please click on the following link to activate your account, or paste this into your browser to complete the process:' +
                        '(The link will expire after 24 hours)\n\n' +
                        'http://' + req.headers.host + '/verify/?token=' + token + '\n\n';
                    sendMail(emailParams);
                    res.send({"success":true,"message":"ok","data":"confirmation email has been sent"});
                }
            });
        }
        else {
            res.send({"success":true,"message":"ok","data":"invalid email address"});
        }
    });
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

//user can't log in because he forgets password
router.post('/forgot', function(req, res, next) {
    emailExistence.check(req.body.email, function(err, truth) {
        if (!truth) res.send({"success":true,"message":"ok","data":"invalid email address"});
        User.findOne({email: req.body.email}, function (err, user) {
            if (!user) res.send({"success":true,"message":"ok","data":"No account with that email address exists."});
            else {
                if (user.status == 0) {
                    res.send({"success":true,"message":"ok","data":"Your account has not been activated, please go to activate your account"});
                    return;
                }
                var token = uuid.v1();
                console.log('forgot: ' + user.uid);
                redisClient.set(token, user.uid);
                redisClient.expire(token, tokenExpire);//token will expire after 24 hours
                emailParams.Message.Subject.Data = 'Reset The Password';
                emailParams.Destination.ToAddresses.push(req.body.email);
                emailParams.Message.Body.Text.Data = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:(The link will expire after 24 hours)\n\n' +
                    'http://' + req.headers.host + '/user/profile/' + user.uid + '/admin?access_token=' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n';
                sendMail(emailParams);
                res.send({"success":true,"message":"ok","data":"Reset password email has been sent", token: token});
            }
        });
    });
});


//resend email to activate account
router.post('/resend', function(req, res, next) {
    emailExistence.check(req.body.email, function(err, truth) {
        if (!truth) {
            res.send("invalid email address");
            return;
        }
        User.findOne({email: req.body.email}, function (err, user) {
            var token = uuid.v1();
            redisClient.set(token, req.body.uid);
            redisClient.expire(token, tokenExpire);//token will expire after 24 hours
            emailParams.Message.Subject.Data = 'Activate Your Account';
            emailParams.Destination.ToAddresses.push(req.body.email);
            emailParams.Message.Body.Text.Data =
                'Please click on the following link to activate your account, or paste this into your browser to complete the process:' +
                '(The link will expire after 24 hours)\n\n' +
                'http://' + req.headers.host + '/verify/?access_token=' + uid + '\n\n';
            sendMail(emailParams);
            res.send("confirmation email has been sent");
        });
    });
});


router.post('/login', function(req, res) {
    console.log(req.body);
    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user)
            res.send({"success":true,"message":"ok","data":"Incorrect email or password."});
        else {
            if (user.status == 0) res.send({"success":true,"message":"ok","data":"Your account has not been activated, please go to activate your account"});
            else if (bcrypt.compareSync(req.body.password, user.password)) {
                var token = uuid.v1();
                redisClient.set(token, user.uid);
                redisClient.expire(token, actionExpire);//token will expire after 15 minutes
                res.send({"success":true,"message":"ok","data":{page:'user', "token": token}});
            }
            else
                res.send({"success":true,"message":"ok","data":"Incorrect email or password."});
        }
    });
});

router.get('/login', function(req, res, next) {
    res.render('login');
});


router.post('/logout', tokenAuth.requireToken, function(req, res, next) {
    redisClient.del(req.body.access_token, function(err, reply) {
        if (reply) res.render('/');
        else console.log(err);
    });
});

/****************************** Resume Page *************************************/

router.get('/resume/:rid', tokenAuth.requireToken, function (req, res, next) {
    res.render('resume');
});


router.get('/resume/:rid/data', tokenAuth.requireToken, function (req, res, next) {
    Resume.findOne({rid: req.params.rid}, function (err, resume) {
        res.send({resume: resume, current_user_id: req.user.uid, current_user_name: req.user.username});
    });
});

router.get('/resume/:rid/comment/data', tokenAuth.requireToken, function (req, res, next) {
    Resume.findOne({rid: req.params.rid}, function (err, resume) {
        res.send(resume[0].comments);
        console.log("send resume comments");
        console.log(resume.comments);
        res.send(resume.comments);
    });
});




//add a comment
var sqsSendParams = {
    QueueUrl: "",
    MessageAttributes: {
        someKey: { DataType: 'String', StringValue: "string"}
    }
};

var sqsGetParams = {
    QueueName: ""
};


router.post('/resume/:rid/comment', tokenAuth.requireToken, function (req, res, next) {
    var comment = JSON.parse(req.body.commentJSON);
    comment._id = undefined;
    Resume.update({rid: req.params.rid}, {
        $push: {
            comments: comment
        }
    }, function (err, data) {
        if (err) throw err;
        //sqsGetParams.QueueName = req.body.reviewee_id;
        //sendMessageToQueue(sqsGetParams, sqsSendParams, req.body.author_id, req.user.uid, req.body.reviewee_id,
        //    req.body.subject, req.body.link);
        //if (req.body.author_id != req.body.reviewee_id) {
        //    sqsGetParams.QueueName = req.body.author_id;
        //    sendMessageToQueue(sqsGetParams, sqsSendParams, req.body.author_id, req.user.uid, req.body.reviewee_id,
        //        req.body.subject, req.body.link);
        //}

        //notify author and reviewee
    });
});

//delete a comment
router.delete('/resume/:rid/comment', tokenAuth.requireToken, function(req, res, next) {
    var comment = JSON.parse(req.body.commentJSON);
    Resume.update({rid: req.params.rid}, {
        $pull: {
            comments: comment
        }
    }, function (err, data) {
        if (err) throw err;
    });
});




module.exports = router;
