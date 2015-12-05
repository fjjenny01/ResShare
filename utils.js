/**
 * Created by jingxiaogu on 11/29/15.
 */
var csrf = require('csurf');
var mongoose = require('mongoose');
var session = require('client-sessions');


module.exports.createUserSession = function(req, res, user) {
    var cleanUser = {
        email: user.email
    };
    req.session.user = cleanUser;
    req.user = cleanUser;
    res.locals.user = cleanUser;
};

module.exports.requireLogin = function(req, res, next) {
    if (!req.user) res.redirect('/login');
    else next();
};


