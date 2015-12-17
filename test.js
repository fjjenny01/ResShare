//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//mongoose.connect("mongodb://jingxiao:jingxiao@ds059654.mongolab.com:59654/reshare");

var User = require('./model/dbModel').user;


//db.collection("articles").insert(
//    [
//        { _id: 1, subject: "coffee", author: "xyz", views: 50 },
//        { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
//        { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
//        { _id: 4, subject: "baking", author: "xyz", views: 100 },
//        { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
//        { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
//        { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
//        { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
//    ]
//)
//
//var db = mongoose.model("article", new Schema({
//    _id: Number,
//    subject: String,
//    author: String,
//    views: Number,
//    tag: [String]
//}).index({tag: "text", subject: "text"}));


//var o1 = new db({_id: 1, subject: "coffee", author: "xyz", views: 50, tag: ["engineer", "market"]});
//var o2 = new db({_id: 2, subject: "Coffee Shopping", author: "efg", views: 5, tag: ["software", "engineer"]});
//var o3 = new db({_id: 3, subject: "Baking a cake", author: "abc", views: 90, tag: ["economic", "math"]});
//var o4 = new db({_id: 4, subject: "baking", author: "xyz", views: 100, tag: ["math", "physics"]});
//var o5 = new db({_id: 5, subject: "Café Con Leche", author: "abc", views: 200, tag: ["engineer", "physics"]});
//var o6 = new db({_id: 6, subject: "Сырники", author: "jkl", views: 80, tag: ["market", "engineer"]});
//var o7 = new db({_id: 7, subject: "coffee and cream", author: "efg", views: 10, tag: ["engineer", "software"]});
//var o8 = new db({_id: 8, subject: "Cafe con Leche", author: "xyz", views: 10, tag: ["market", "math"]});
//
//o1.save();
//o2.save();
//o3.save();
//o4.save();
//o5.save();
//o6.save();
//o7.save();
//o8.save();

//db.find({$text: {$search: "coffee"}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}})
//    .exec(function(err, results) {
//        console.log(results);
//    });


User.find({email: "jingxiaogu1992@gmail.com"}, function(err, user) {
    console.log(user);
});


