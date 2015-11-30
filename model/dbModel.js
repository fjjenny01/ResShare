/**
 * Created by jingxiaogu on 11/29/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports.user = mongoose.model('user', new Schema({
    email: {type: String, unique: true},
    password: String
}));