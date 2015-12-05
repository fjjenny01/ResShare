/**
 * Created by jingxiaogu on 11/29/15.
 */
var db = require('../model/dbModel');
var utils = require('../utils');

//load users from session data
module.exports.simpleAuth = function(req, res, next) {
    if (req.session && req.session.user) {
        db.user.findOne({ email: req.session.user.email}, function(err, user) {
            if (user) utils.createUserSession(req, res, user);
        });
    }
    next();
};