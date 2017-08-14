var config = require("./config");
var mongoose = require("mongoose");
var Book = require("./app/models/book");
var Genre = require("./app/models/genre");
var Shelf = require("./app/models/shelf");
var Settings = require("./app/models/settings");
var User = require("./app/models/user");

var port = process.env.PORT || 8333;

var dropCollection = function(model){
    model.collection.drop();
}

let connection = mongoose.connect(config.database);

console.log("connected");

dropCollection(Book);
dropCollection(Genre);
dropCollection(Shelf);
dropCollection(Settings);
dropCollection(User);

console.log("dropped existing collections..");

process.exit(0);

