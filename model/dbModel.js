/**
 * Created by jingxiaogu on 11/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var redis = require('redis');

//connect to userDB
var userUrl = 'mongodb://jingxiao:jingxiao@ds059654.mongolab.com:59654/reshare';
mongoose.connect(userUrl, function() {
    console.log('db connected');
});

//connect to redis
var host = 'pub-redis-18392.us-east-1-2.2.ec2.garantiadata.com';
var port = 18392;
var password = 'jingxiao';
var client = redis.createClient(port, host); //creates a new client
client.auth(password);
client.on('connect', function() {
    console.log('connected to redis');
});

module.exports.user = mongoose.model('user', new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
    password: String,
    status: Number, //0: unactivated, 1: activated
    company: String,
    interested_field: [String],
    resume: [[String]],
    avatar: String
}));

module.exports.redisClient = client;