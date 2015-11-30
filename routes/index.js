var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require('../model/dbModel');
var utils = require('../utils');
var emailExistence = require('email-existence');

router.post('/register', function(req, res) {
    emailExistence.check(req.body.email, function(err, truth){
        if (truth) {
            var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
            var user = new db.user({
                email: req.body.email,
                password: hash
            });
            user.save(function(err) {
                if (err) {
                    var error = 'Something bad happened! Please try again.';
                    if (err.code === 11000) {
                        error = 'This email is already taken, please try another.';
                    }
                    res.render('register', { error: error });
                }
                else {
                    utils.createUserSession(req, res, user);
                    res.redirect('dashboard');
                }
            });
        }
        else {
            var error = "invalid email address";
            res.render('register', { error: error});
        }
    });
});

router.get('/register', function(req, res) {
    //res.render('register', { csrfToken: req.csrfToken() });
    res.render('register');
});

router.post('/login', function(req, res) {
    db.user.findOne({ email: req.body.email }, function(err, user) {
        if (!user)
            res.render('login', { error: "Incorrect email / password." });
        else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                utils.createUserSession(req, res, user);
                res.redirect('dashboard');
            }
            else
                //res.render('login', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
                res.render('login', { error: "Incorrect email / password."});
        }
    });
});

router.get('/login', function(req, res) {
    //res.render('login', { csrfToken: req.csrfToken() });
    res.render('login');

});

router.post('/logout', function(req, res) {
    if (req.session) req.session.reset();
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    if (req.session) req.session.reset();
    res.redirect('/');
});

router.get('/dashboard', utils.requireLogin, function(req, res) {
    res.render('dashboard');
});





module.exports = router;
