var AWS = require('aws-sdk');
var fs = require('fs');
//var awsconfig = require('./config/awsconfig');
var params = {
    Bucket: "reshare/resume",
    Key: "test.pdf",
    Body: "",
    ACL: 'public-read'
};

AWS.config.loadFromPath('./config/awsconfig.json');


var s3 = new AWS.S3();


fs.readFile("/Users/jingxiaogu/Desktop/p50-armbrust.pdf", function(err, data) {
    if (err) throw err;
    //var b64string = new Buffer(data).toString('base64');
    //console.log(b64string);
    //var buf = new Buffer(data);
    //params.Body = buf;
    params.Body = data;
    s3.upload(params, function(err, res) {
        if (err) console.log(err);
        else console.log(res.Location);
    });
});


//var buf = new Buffer(b64string, 'base64');
//console.log(buf);
//params.Body = buf;
//s3.upload(params, function (err, res) {
//    if (err) console.log(err);
//    else console.log(res.Location);
//});


//var params = {
//    Bucket: 'reshare-resume/resume',
//    Key: 'p50-armbrust.pdf'
//};
//s3.deleteObject(params, function(err, data) {
//    if (err) console.log(err, err.stack); // an error occurred
//    else {
//        console.log("sda");
//        console.log(data);
//    }           // successful response
//});