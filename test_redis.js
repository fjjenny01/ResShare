var redis = require('redis');
var host = 'pub-redis-18392.us-east-1-2.2.ec2.garantiadata.com';
var port = 18392;
var password = 'jingxiao';
var client = redis.createClient(port, host); //creates a new client
client.auth(password);
client.on('connect', function() {
    console.log('connected to redis');
});

//client.set("qwertyuiop", "623fe180-a6a0-11e5-905f-75b7c1c77530");
//client.expire("qwertyuiop", 60 * 60 * 24);
//client.set('f6a76340-a5ef-11e5-a8fa-8575177799ad', "1375c640-a5d9-11e5-83d9-83c2bc5eeb3e");
//client.expire('f6a76340-a5ef-11e5-a8fa-8575177799ad', 60 * 60 * 24);


//client.del('qwertyuiop', function(err, reply) {
//    console.log(reply);
//});


client.keys('*', function (err, keys) {
    if (err) return console.log(err);
    for(var i = 0, len = keys.length; i < len; i++) {
        //client.del(keys[i], function(err, reply) {
        //    console.log(reply);
        //});
        console.log(keys[i]);
        //client.get(keys[i], function(err, reply) {
        //    if (reply) {
        //        console.log(reply);
        //    }
        //});
    }
});
//
//
//client.get("2d8d6260-a79e-11e5-8dae-c72952bab9be", function (err, reply) {
//    console.log(reply);
//});