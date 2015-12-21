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


//client.create({
//    index: 'reshare',
//    type: 'resume',
//    id: 'ca9b1dab-b6bc-409a-8f3e-baad24d2866c',
//    body: {
//        "uid": "300690b0-a696-11e5-8c5b-51ef6d5335f6",
//        "username": "shawn",
//        "rid": "ca9b1dab-b6bc-409a-8f3e-baad24d2866c",
//        "resumename": "Resume(JingxiaoGu).pdf",
//        "url": "https://s3.amazonaws.com/czcbucket/ca9b1dab-b6bc-409a-8f3e-baad24d2866c.pdf",
//        "link": "localhost:3000/resume/ca9b1dab-b6bc-409a-8f3e-baad24d2866c",
//        "subject": "Seeking for SDE intern",
//        "content": "Hi, everyone, this is my resume. I am looking for an internship as a SDE next summer",
//        "status": 1,
//        "comments": [],
//        "tag": [
//            "Software Development",
//            "Design",
//            "Consulting"
//        ],
//        "avatar": {
//            "url": "https://s3.amazonaws.com/czcbucket%2Favatars/1450701486495.jpeg",
//            "aid": "3006b7c0-a696-11e5-8c5b-51ef6d5335f6"
//        },
//        "__v": 0
//    }
//}, function (error, response) {
//
//});






client.search({
    index: 'reshare',
    body: {
        query: {
            multi_match: {
                query: "jin Fang",
                fields: ['subject', 'content', 'tag', 'username'],
                operator: 'or',
                fuzziness: 'AUTO'
            }
        }
    }
}, function (error, response) {
    console.log("sadaaaaaaaaaaa");
    console.log(response.hits.hits);
});

//client.delete({
//    index: 'reshare',
//    type: 'resume',
//    id: '66a5f850-ad48-4d67-beb6-eab44b94e7c1'
//}, function (error, response) {
//
//});

//client.update({
//    index: 'reshare',
//    type: 'resume',
//    id: "cc955709-b5d8-40a7-aa7f-818ed61a050d",
//    body: {
//        doc: {
//            username: "jin Fang"
//        }
//    }},function(err, res) {
//});


