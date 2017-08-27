var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    description: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    status:  { type: String, default: 'ok' },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genres'
    },
    shelves: [String],
    ownACopy: { type: Boolean, default: false },
    readDate: Date,
    timesRead: { type: Number, default: 0 },
    userName: { type: String},
    author: {type:String},
    url: {type:String},
    imageUrl: {type:String},
    authorBioUrl: {type:String}
});

module.exports = mongoose.model('books', bookSchema);