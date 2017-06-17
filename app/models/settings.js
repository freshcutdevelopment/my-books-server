var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
    key: String,
    value: String
});

module.exports = mongoose.model('settings', settingsSchema);