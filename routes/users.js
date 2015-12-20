var express = require('express');
var router = express.Router();
var User = require('../model/dbModel').user;
var Resume = require('../model/dbModel').resume;
var tokenAuth = require('../middleware/tokenAuth');
var awsconfig = require('../config/awsconfig');
var aws = require('aws-sdk');


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



/****************************** News Page ***********************************/

router.get('/', tokenAuth.requireToken, function (req, res, next) {
    res.render('user');
});

router.get('/data', tokenAuth.requireToken, function (req, res, next) {
    if (req.user.interested_field.length == 0) {
        Resume.find({status: 1}, function(err, resume) {
            resume = resume.reverse().splice(0, 21);
            var data = {"user": req.user, "resume": resume};
            res.send(data);
        })
    }
    else {
        Resume.find({status: 1, tag: {$in: req.user.interested_field}}, function (err, resume) {
            resume = resume.reverse().splice(0, 21);
            var data = {"user": req.user, "resume": resume};
            res.send(data);
        });
    }
});

//search
//url: /user/search/?kw=xxx
router.post('/search', tokenAuth.requireToken, function(req, res, next) {
    res.render('user');
});

router.get('/search/data', tokenAuth.requireToken, function(req, res, next) {
    Resume.find({$text: {$search: req.query.kw}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
        .exec(function (err, data) {
            res.send(data);
        });
});



/*************************** User Profile Page ******************************/

//user edit information
router.post('/profile/edit', tokenAuth.requireToken, function (req, res, next) {
    res.render('profile');
});

router.get('/profile/:uid/data', tokenAuth.requireToken, function (req, res, next) {
    if (req.user.uid == req.params.uid) {
        req.user.self = true;
        res.send(req.user);
    }
    else {
        User.findOne({uid: req.params.uid}, function (err, user) {
            if (err) throw err;
            user.self = false;
            res.send(user);
        });
    }
});



//user has logged in and want to reset password
router.post('/profile/password/edit', tokenAuth.requireToken, function (req, res, next) {
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
            res.render("password_reset");
        }
    });
});

router.post('/profile/info/edit', tokenAuth.requireToken, function (req, res, next) {
    User.update({uid: req.user.uid}, {$set: req.user}, function (err, data) {
        if (err) throw err;
    });
});


//user modify avatar
router.post('/profile/avatar/edit', tokenAuth.requireToken, function (req, res, next) {
    User.update({uid: req.user.uid}, {$set: {avatar: req.body.avatar}}, function (err, result) {
        if (err) throw err;
    });
});


router.get('/profile/:uid/topic', tokenAuth.requireToken, function(req, res, next) {
    Resume.find({uid: req.params.uid}, function (err, data) {
        if (err) throw err;
        res.send(data);
    });
});



/********************************* User Resume Page ******************************/

router.get('/resume', tokenAuth.requireToken, function (req, res, next) {
    res.render('user_resume');
});

router.get('/resume/data', tokenAuth.requireToken, function (req, res, next) {
    Resume.find({uid: req.user.uid}, function (err, data) {
        res.send(data);
    });
});

//upload a resume
router.post('/resume/upload', tokenAuth.requireToken, function(req, res, next) {
    //console.log(req.body);
    console.log(req.body.rid);
    console.log(req.body.url);
    console.log(req.body.tag);
    console.log(req.body.resumename);
    var record = new Resume({
        uid: req.user.uid,
        username: req.user.username,
        avatar: req.user.avatar,
        rid: req.body.rid,
        resumename:req.body.resumename,
        url: req.body.url,
        tag: JSON.parse(req.body.tag),
        status: 0
    });
    record.save();
});

router.get('/resume/aws/data', tokenAuth.requireToken, function (req, res, next) {
    res.send(awsconfig);
});

//delete a resume
router.post('/resume/delete', tokenAuth.requireToken, function (req, res, next) {
    console.log(req.body.rid);
    Resume.remove({rid: req.body.rid}, function (err, data) {
        if (err) throw err;
        else {
            console.log("asda");
        }
    });
});

//share resume
router.post('/resume/share', tokenAuth.requireToken, function (req, res, next) {
    console.log(link);
    var link = "/resume/" + req.body.rid;
    Resume.update({rid: req.body.rid}, {$set: {
        link: link,
        subject: req.body.subject,
        content: req.body.content,
        status: 1
    }}, function (err) {
        if (err) throw err;
    });
});

//add a comment
router.post('/resume/comment', tokenAuth.requireToken, function(req, res, next) {
    Resume.update({rid: req.body.rid}, {
        $push: {
            comments:{uid: req.user.uid, comment: req.body.comment}
        }
    }, function (err, data) {
        if (err) throw err;
    });
});

//delete a comment
router.delete('/resume/comment', tokenAuth.requireToken, function(req, res, next) {
    Resume.update({rid: req.body.rid}, {
        $pull: {
            comments: {uid: req.user.uid, comment: req.body.comment}
        }
    }, function (err, data) {
        if (err) throw err;
    });
});



module.exports = router;
