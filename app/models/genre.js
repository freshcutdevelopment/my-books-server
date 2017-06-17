var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var genreSchema = new Schema({
    name: String
});

module.exports = mongoose.model('genres', genreSchema);