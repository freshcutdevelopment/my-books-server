var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({ 
    name: String, 
    password: String, 
    admin: Boolean,
    email:String,
    first_name:String,
    surname:String,
    country:String
}));