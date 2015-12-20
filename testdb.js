var User = require('./model/dbModel').user;
//var record = new User({
//    username: "shawn",
//    firstname: '',
//    lastname: '',
//    uid: "safdsaf",
//    email: "jingxiao1216@gmail.com",
//    password: "123",
//    status: 0,
//    company: '',
//    interested_field: [],
//    avatar: {url: '', aid: ''}
//});
//record.save();

var avatar = {url: "www.", aid: "121"};
var tag = ["engineering", 'finance'];
User.update({email: "jingxiao1216@gmail.com"}, {$set: {
    avatar: avatar,
    interested_field: tag
}}, function (err, data) {
    if (err) throw err;
});
