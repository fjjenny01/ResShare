var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../model/dbModel').user;
var emailExistence = require('email-existence');
var aws = require('aws-sdk');
var uuid = require('node-uuid');
var redisClient = require('../model/dbModel').redisClient;
var tokenAuth = require('../middleware/tokenAuth');


var tokenExpire = 60 * 60 * 24;
var actionExpire = 60 * 15;

aws.config.loadFromPath('./config/awsconfig.json');

// Instantiate SES.
var ses = new aws.SES();
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


//router.get('/test', function(req, res, next) {
//    console.log(req.headers.host);
//    console.log(req);
//});

router.get('/verify', function (req, res, next) {
    var token = req.query.token;
    redisClient.get(token, function(err, reply) {
        if (reply) {
            User.update({email: reply}, {$set:{status: 1}}, function(err, result) {
                if (err) res.write("internal err");
                else res.send("Your account has been activated");
            });
            redisClient.del(token, function(err, res) {
                if (err) console.log(err);
            });
        }
        else {
            res.send("verification token has expired, please click the resend confirmation button");
        }
    });
});

router.post('/register', function(req, res, next) {
    emailExistence.check(req.body.email, function(err, truth){
        if (truth) {
            if (req.body.password != req.body.confirm_password) {
                res.send("password doesn't match, please try again");
                return;
            }
            var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            var record = new User({
                email: req.body.email,
                password: hash,
                status: 0
            });
            var uid = uuid.v4();
            redisClient.set(uid, req.body.email);
            redisClient.expire(uid, tokenExpire);//token will expire after 24 hours
            record.save(function(err) {
                if (err) {
                    var error = 'DB internal error';
                    if (err.code == 11000) {
                        error = 'This email is already taken, please try another.';
                    }
                    res.send(error);
                }
                else {
                    emailParams.Message.Subject.Data = 'Activate Your Account';
                    emailParams.Destination.ToAddresses.push(req.body.email);
                    emailParams.Message.Body.Text.Data =
                        'Please click on the following link to activate your account, or paste this into your browser to complete the process:' +
                        '(The link will expire after 24 hours)\n\n' +
                        'http://' + req.headers.host + '/verify/?token=' + uid + '\n\n';
                    sendMail(emailParams);
                    res.send("confirmation email has been sent");
                }
            });
        }
        else {
            res.send("invalid email address");
        }
    });
});

router.get('/register', function(req, res, next) {
    res.render('register');
    res.send(1);
});

//user can't log in because he forgets password
router.post('/forgot', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
       if (!user) res.send("No account with that email address exists.");
       else {
           if (user.status == 0) {
               res.send("Your account has not been activated, please go to activate your account");
               return;
           }
           var uid = uuid.v4();
           redisClient.set(uid, req.body.email);
           redisClient.expire(uid, tokenExpire);//token will expire after 24 hours
           emailParams.Message.Subject.Data = 'Reset The Password';
           emailParams.Destination.ToAddresses.push(req.body.email);
           emailParams.Message.Body.Text.Data = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
               'Please click on the following link, or paste this into your browser to complete the process:(The link will expire after 24 hours)\n\n' +
               'http://' + req.headers.host + '/reset/?token='  + uid + '\n\n' +
               'If you did not request this, please ignore this email and your password will remain unchanged.\n';
           sendMail(emailParams);
           res.send("Reset password email has been sent");
       }
    });
});


//user has logged in and want to reset password
router.post('/reset', tokenAuth.requireToken, function (req, res, next) {
    if (req.body.password != req.body.confirm_password) {
        res.send("passwords don't match, please try again");
        return;
    }
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.update({email: req.user.email}, {$set: {password: hash}}, function (err, result) {
        if (err) res.send("internal err");
        else {
            res.send("Your password has been successfully reset");
            emailParams.Message.Subject.Data = 'Your password has been changed';
            emailParams.Destination.ToAddresses.push(req.body.email);
            emailParams.Message.Body.Text.Data = 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + req.body.email + ' has just been changed.\n';
            sendMail(emailParams);
            res.send(req.body.access_token);
        }
    });
});

router.get('/reset', tokenAuth.requireToken, function(req, res, next) {
    res.render('reset');
});

//resend email to activate account
router.post('/resend', function(req, res, next) {
    emailExistence.check(req.body.email, function(err, truth) {
        if (!truth) {
            res.send("invalid email address");
            return;
        }
        var uid = uuid.v4();
        redisClient.set(uid, req.body.email);
        redisClient.expire(uid, tokenExpire);//token will expire after 24 hours
        emailParams.Message.Subject.Data = 'Activate Your Account';
        emailParams.Destination.ToAddresses.push(req.body.email);
        emailParams.Message.Body.Text.Data =
            'Please click on the following link to activate your account, or paste this into your browser to complete the process:' +
            '(The link will expire after 24 hours)\n\n' +
            'http://' + req.headers.host + '/verify/?token=' + uid + '\n\n';
        sendMail(emailParams);
        res.send("confirmation email has been sent");
    });
});


router.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user)
            res.send("Incorrect email or password.");
        else {
            if (user.status == 0) res.send("Your account has not been activated, please go to activate your account");
            else if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send("allow login");
                var uid = uuid.v4();
                redisClient.set(uid, req.body.email);
                redisClient.expire(uid, actionExpire);//token will expire after 15 minutes
                res.render('/user/profile');
            }
            else
                res.send("Incorrect email or password.");
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

router.get('/user/profile', tokenAuth.requireToken, function(req, res, next) {
    res.send(req.user);
    res.send('/user/profile');
});

router.post('/user/profile/edit', tokenAuth.requireToken, function (req, res, next) {
    User.update({email: req.user.email}, {$set: req.user}, function (err, data) {
        if (err) throw err;
        else {
            res.render('/user/profile');
        }
    });
});

var s3 = new aws.S3();
var uploadAvatarParams = {
    Bucket: "reshare/avatar",
    Key: "",
    Body: ""
};

//var avatar = 1;
//router.post('/user/profile/avatar', tokenAuth.requireToken, function(req, res, next) {
//    var b64string = req.body.avatar;
//
//});











var uploadResumeParams = {
    Bucket: "reshare/resume",
    Key: "",
    Body: ""
};

var doc = 1;

router.post('/user/profile/resume/upload', function (req, res, next) {
    var b64string = req.body.file;
    uploadResumeParams.key = doc + ".pdf";
    doc++;
    uploadResumeParams.Body = new Buffer(b64string, 'base64');
    s3.upload(uploadResumeParams, function (err, data) {
        if (err) throw err;
        else {
            User.findOne({email: "jingxiaogu1992@gmail.com"},function(err, user) {
                req.user = user;
                req.user.resume.push([data.Location, uploadResumeParams.key]);
                User.update({email: req.user.email}, {$set: {resume: req.user.resume}}, function (err, result) {
                    if (err) throw err;
                    else {
                        res.send(req.user);
                        res.render('myresume');
                    }
                })
            });
        }
    });
});

router.get('/user/profile/resume', function (req, res, nex) {
    res.render('myresume');
});



var deleteResumeParams = {
    Bucket: 'reshare/resume',
    Key: ""
};
router.delete('/user/profile/resume/delete', tokenAuth.requireToken, function (req, res, next) {
    deleteResumeParams.Key = req.body.resume[1];
    req.user.resume.splice([req.body.resume[0], req.body.resume[1]], 1);
    s3.deleteObject(params, function(err, data) {
        if (err) throw err;
        else {
            User.update({email: req.user.email}, {$set: {resume: req.user.resume}}, function(err, result) {
                if (err) throw err;
                else {
                    res.send(req.user);
                    res.render('/user/profile/resume');
                }
            });
        }
    });
});










module.exports = router;
