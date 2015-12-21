/**
 * Created by jingxiaogu on 11/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var redis = require('redis');
var elasticsearch = require('elasticsearch');


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


//connect to elasticsearch
var elsClient = new elasticsearch.Client({
    host: '52.90.198.176:9200',
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


//var commentJSON = {
//    author_id: ,
//    current_user_id: ,
//
//    //id: 'c' +  (this.getComments().length + 1),   // Temporary id
//    parent: textarea.attr('data-parent') || null,
//    created: time,
//    modified: time,
//    content: this.getTextareaContent(textarea),
//    fullname: ,
//    //fullname: this.options.textFormatter(this.options.youText),
//    link: ,
//    profilePictureURL: ,
//    //profilePictureURL: this.options.profilePictureURL,
//    createdByCurrentUser: true,
//    upvoteCount: 0,
//    userHasUpvoted: false
//};


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
        createdByCurrentUser: Boolean,
        upvoteCount: 0,
        userHasUpvoted: Boolean
    }]
}).index({username: "text", subject: "text", tag: "text"}));

module.exports.redisClient = client;