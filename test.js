//var redis = require('redis');
//var host = 'pub-redis-18392.us-east-1-2.2.ec2.garantiadata.com';
//var port = 18392;
//var client = redis.createClient(port, host); //creates a new client
//client.auth('jingxiao');
//client.on('connect', function() {
//    console.log('connected');
//});
//
////client.set('framework', 'AngularJS');
//
//
////client.hmset('frameworks', {
////    'javascript': 'AngularJS',
////    'css': 'Bootstrap',
////    'node': 'Express'
////});
//
////client.expire('frameworks', 30);
//
//
////client.hgetall("frameworks", function (err, obj) {
////    console.log(obj);
////});
//
//client.del('framework', function(err, reply) {
//    console.log(reply);
//});
//
//client.keys('*', function (err, keys) {
//    if (err) return console.log(err);
//    console.log(keys.length);
//    for(var i = 0, len = keys.length; i < len; i++) {
//        console.log(keys[i]);
//    }
//});
//
//
////client.get('framework', function(err, reply) {
////    console.log(reply);
////});
var a = [[1, 10], [2, 20], [3, 30]];
for (var i = 0; i < a.length; i++)
    console.log(a[i]);
