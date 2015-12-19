/**
 * Created by jingxiaogu on 11/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var redis = require('redis');

//connect to DB
var dbUrl = 'mongodb://jingxiao:jingxiao@ds059654.mongolab.com:59654/reshare';
mongoose.connect(dbUrl, function() {
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
    username: String,
    firstname: String,
    lastname: String,
    uid: String,
    email: {type: String, unique: true},
    password: String,
    status: Number, //0: unactivated, 1: activated
    company: String,
    interested_field: [String],
    avatar: {url: String, aid: String}
}));


module.exports.resume = mongoose.model('resume', new Schema({
    uid: String,
    username: String,
    avatar: {url: String, aid: String},
    rid: String,
    resumename: String,
    url: String,
    link: String,
    subject: String,
    content: String,
    tag: [String],
    status: Number,
    comments: [{
        reviewer_name: String,
        reviewee_name: String,
        author_name: String,
        comment: String
    }]
}).index({username: "text", subject: "text", tag: "text"}));

module.exports.redisClient = client;