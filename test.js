var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect("mongodb://jingxiao:jingxiao@ds059654.mongolab.com:59654/reshare");
//
////var User = require('./model/dbModel').user;
//var Resume = require('./model/dbModel').resume;
//
//
////db.collection("articles").insert(
////    [
////        { _id: 1, subject: "coffee", author: "xyz", views: 50 },
////        { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
////        { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
////        { _id: 4, subject: "baking", author: "xyz", views: 100 },
////        { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
////        { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
////        { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
////        { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
////    ]
////)
////
var db = mongoose.model("article", new Schema({
    _id: Number,
    subject: String,
    author: String,
    views: Number,
    tag: [String]
}).index({tag: "text", subject: "text"}));
//
//
////var o1 = new db({_id: 1, subject: "coffee", author: "xyz", views: 50, tag: ["engineer", "market"]});
////var o2 = new db({_id: 2, subject: "Coffee Shopping", author: "efg", views: 5, tag: ["software", "engineer"]});
////var o3 = new db({_id: 3, subject: "Baking a cake", author: "abc", views: 90, tag: ["economic", "math"]});
////var o4 = new db({_id: 4, subject: "baking", author: "xyz", views: 100, tag: ["math", "physics"]});
////var o5 = new db({_id: 5, subject: "Café Con Leche", author: "abc", views: 200, tag: ["engineer", "physics"]});
////var o6 = new db({_id: 6, subject: "Сырники", author: "jkl", views: 80, tag: ["market", "engineer"]});
////var o7 = new db({_id: 7, subject: "coffee and cream", author: "efg", views: 10, tag: ["engineer", "software"]});
////var o8 = new db({_id: 8, subject: "Cafe con Leche", author: "xyz", views: 10, tag: ["market", "math"]});
////
////o1.save();
////o2.save();
////o3.save();
////o4.save();
////o5.save();
////o6.save();
////o7.save();
////o8.save();
//
db.find({$text: {$search: "coff"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
    .exec(function(err, results) {
        console.log(results);
    });


//var o1 = new User({
//    username: "shawn",
//    firstname: "jingxiao",
//    lastname: "gu",
//    uid: "abcde",
//    email: "jingxiao1216@gmail.com",
//    password: "ashklsahflashdlkjashd",
//    status: 1, //0: unactivated, 1: activated
//    company: "Columbia University",
//    interested_field: ["Computer Science", "Engineering"],
//    avatar: {url: "https://s3.amazonaws.com/reshare%2Favatar/default-profile.png", aid: "sadsdasfjsakhjlskadjklaj"}
//});
//
//var o2 = new User({
//    username: "chazc",
//    firstname: "zichen",
//    lastname: "chao",
//    uid: "fgh",
//    email: "chaozichen@columbia.edu",
//    password: "ueiowajdkaskd",
//    status: 1, //0: unactivated, 1: activated
//    company: "Columbia University",
//    interested_field: ["Computer Science", "Engineering"],
//    avatar: {url: "https://s3.amazonaws.com/reshare%2Favatar/default-profile.png", aid: "sadswqrqklaj"}
//});
//
//
//var o3 = new Resume({
//    uid: "abcde",
//    username: "shawn",
//    avatar: {url: "https://s3.amazonaws.com/reshare%2Favatar/default-profile.png", aid: "sadsdasfjsakhjlskadjklaj"},
//    rid: "123456",
//    url: "www.s3.r1.pdf",
//    link: "www.google.com",
//    subject: "Can anyone help me with my resume?",
//    content: "I don't know what to do, my resume is messy.",
//    tag: ["Engineering"],
//    status: 1
//});
////
////
////var o4 = new Resume({
////    uid: "fgh",
////    username: "chazc",
////    avatar: {url: "https://s3.amazonaws.com/reshare%2Favatar/default-profile.png", aid: "sadswqrqklaj"},
////    rid: "124432",
////    url: "www.s3.r2.pdf",
////    link: "www.baidu.com",
////    subject: "Looking for someone to improve my resume",
////    content: "Can anyone give me some advice on how to improve my resume, thx",
////    tag: ["Computer Science"],
////    status: 1
////});
////
//////o1.save();
//////o2.save();
//o3.save();
////o4.save();
//
//var b = 60 * 60 * 24;
//console.log(b);



