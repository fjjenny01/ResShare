/**
 * Created by jingxiaogu on 12/2/15.
 */
var User = require('../model/dbModel').user;
var redisClient = require('../model/dbModel').redisClient;

module.exports.requireToken = function(req, res, next) {
    var token = (req.body.access_token || req.query.token);
    redisClient.get(token, function(err, reply) {
        if (reply) {
            User.findOne({uid: reply},function(err, user) {
                req.user = user;
                redisClient.expire(token, 60 * 15);
                next();
            });
        }
        else res.render('login');
    });
};




