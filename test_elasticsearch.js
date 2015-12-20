var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '52.90.198.176:9200',
    log: 'trace'
});

client.create({
    index: 'reshare',
    type: 'resume',
    body: {
        "uid": "abcde",
        "username": "shawn",
        "link": "www.google.com",
        "subject": "Can anyone help me with my resume?",
        "content": "I don't know what to do, my resume is messy.",
        "comments": [],
        "tag": [
            "Engineering"
        ],
        "avatar": {
            "aid": "sadsdasfjsakhjlskadjklaj",
            "url": "https://s3.amazonaws.com/czcbucket%2Favatars/1450414554170.jpeg"
        },
    }
}, function (error, response) {

});

//client.search({
//    index: 'reshare',
//    body: {
//        query: {
//            multi_match: {
//                query: "gineering",
//                fields: ['subject', 'content', 'tag'],
//                operator: 'or',
//                fuzziness: 'AUTO'
//            }
//        }
//    }
//}, function (error, response) {
//    console.log("sadaaaaaaaaaaa");
//    console.log(response.hits.hits);
//});

//client.delete({
//    index: 'reshare',
//    type: 'resume',
//    id: 'AVG3lh777oMsqiO_6Pve'
//}, function (error, response) {
//
//});

//client.update({
//    index: 'reshare',
//    type: 'resume',
//    id: "AVG3lrON7oMsqiO_6Pvf",
//    body: {
//        doc: {
//            username: "shawn"
//        }
//    }},function(err, res) {
//});


