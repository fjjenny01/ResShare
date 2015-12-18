var aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsconfig.json');

var sqs = new aws.SQS();

var params = {
    QueueName: "MyFirstQueue"
};

sqs.createQueue(params, function(err, data) {
    if (err) {
        throw err;
    }
    else {
        sqs.getQueueUrl(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data.QueueUrl);           // successful response
        });
    }
});




