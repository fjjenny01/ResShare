var redis = require('redis');
var host = 'pub-redis-18392.us-east-1-2.2.ec2.garantiadata.com';
var port = 18392;
var password = 'jingxiao';
var client = redis.createClient(port, host); //creates a new client
client.auth(password);
client.on('connect', function() {
    console.log('connected to redis');
});

//client.set("test", "abcde");
//client.expire("test", 60 * 15);

//client.set('qwertyuiop', "abcde");
//client.expire('qwertyuiop', 60 * 60 * 24);



client.keys('*', function (err, keys) {
    if (err) return console.log(err);
    for(var i = 0, len = keys.length; i < len; i++) {
        console.log(keys[i]);
        //client.del(keys[i], function(err, reply) {
        //    console.log(reply);
        //});
    }
});