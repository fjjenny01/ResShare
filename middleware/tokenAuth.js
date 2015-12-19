/**
 * Created by jingxiaogu on 12/2/15.
 */
var User = require('../model/dbModel').user;
var redisClient = require('../model/dbModel').redisClient;

module.exports.requireToken = function(req, res, next) {
    var token = (req.body.access_token || req.query.access_token);
    console.log(req.query.access_token);
    console.log(token);
    redisClient.get(token, function(err, reply) {
        if (reply) {
            console.log(reply);
            User.findOne({uid: reply},function(err, user) {
                if (err) throw err;
                req.user = user;
                redisClient.expire(token, 60 * 15);
                next();
            });
        }
        else {
            res.render('home_page');
        }
    });
};




