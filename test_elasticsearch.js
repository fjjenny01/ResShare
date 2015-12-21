var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: '52.90.198.176:9200',
    log: 'trace'
});

//client.create({
//    index: 'reshare',
//    type: 'resume',
//    body: {
//        "uid": "abcde",
//        "username": "shawn",
//        "link": "www.google.com",
//        "subject": "Can anyone help me with my resume?",
//        "content": "I don't know what to do, my resume is messy.",
//        "comments": [],
//        "tag": [
//            "Engineering"
//        ],
//        "avatar": {
//            "aid": "sadsdasfjsakhjlskadjklaj",
//            "url": "https://s3.amazonaws.com/czcbucket%2Favatars/1450414554170.jpeg"
//        },
//    }
//}, function (error, response) {
//
//});


client.create({
    index: 'reshare',
    type: 'resume',
    body: {
        "uid": "e7565310-a798-11e5-8246-195085142db7",
        "username": "Jin Fang",
        "rid": "cc955709-b5d8-40a7-aa7f-818ed61a050d",
        "resumename": "resume_JINFANG.pdf",
        "url": "https://s3.amazonaws.com/czcbucket/cc955709-b5d8-40a7-aa7f-818ed61a050d.pdf",
        "link": "localhost:3000/resume/cc955709-b5d8-40a7-aa7f-818ed61a050d",
        "subject": "Share my first Resume",
        "content": "I want a software engineer positon!!!",
        "status": 1,
        "comments": [],
        "tag": [
            "Software Development"
        ],
        "avatar": {
            "aid": "e7565311-a798-11e5-8246-195085142db7",
            "url": "https://s3.amazonaws.com/czcbucket%2Favatars/1450671808362.jpeg"
        },
        "__v": 0
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


