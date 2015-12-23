/**
 * Created by jingxiaogu on 11/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var redis = require('redis');
var elasticsearch = require('elasticsearch');


//connect to DB
var dbUrl = '';
mongoose.connect(dbUrl, function() {
    console.log('db connected');
});

//connect to redis
var host = '';
var port = 18392;
var password = '';
var client = redis.createClient(port, host); //creates a new client
client.auth(password);
client.on('connect', function() {
    console.log('connected to redis');
});


//connect to elasticsearch
var elsClient = new elasticsearch.Client({
    host: '',
    log: 'trace'
});





module.exports.elsClient = elsClient;

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
        author_id: String,
        current_user_id: String,
        id: String,
        parent: String,
        created: String,
        modified: String,
        content: String,
        fullname: String,
        link: String,
        subject: String,
        profile_picture_url: String,
        created_by_current_user: Boolean,
        upvote_count: 0,
        user_has_upvoted: Boolean
    }]
}).index({username: "text", subject: "text", tag: "text"}));

module.exports.redisClient = client;