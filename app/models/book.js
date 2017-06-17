var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    description: String,
    rating: Number,
    status: String,
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genres'
    },
    shelves: [String],
    ownACopy: Boolean,
    readDate: Date,
    timesRead: Number
});

module.exports = mongoose.model('books', bookSchema);