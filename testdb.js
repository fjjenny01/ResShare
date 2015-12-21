var Resume = require('./model/dbModel').resume;
Resume.update({rid: "ca9b1dab-b6bc8f3e-baad24d2866c"}, {username: "shawn"}, {multi: true}, function (err, data) {
    if (err) {
        console.log("sad");
        throw err;
    }
    console.log(data.n);
});