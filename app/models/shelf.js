var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shelfSchema = new Schema({
    name: String
});

module.exports = mongoose.model('shelves', shelfSchema);