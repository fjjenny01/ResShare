var aws = require('aws-sdk');
var awsconfig = require('./config/awsconfig');
var uuid = require('node-uuid');
var querystring = require('querystring');


aws.config.update({
    'accessKeyId': awsconfig.accessKey,
    'secretAccessKey': awsconfig.secretAccessKey,
    'region': awsconfig.region
});
var uid = uuid.v4();

var ses = new aws.SES();
var url = "localhost:3000?token=" + uid;
url = querystring.escape(url);
console.log(url);

var verifyparams = {
    Destination: {ToAddresses: ['jingxiaogu1992@gmail.com']},
    Message: {
        Body: {
            Html: {Data: '<a href="' + url + '">register confirmation</a>'}
        },
        Subject: {Data: 'Test'}
    },
    Source: 'jingxiaogu1992@gmail.com'
};


ses.sendEmail(verifyparams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});