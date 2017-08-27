var config = require("./config");
var mongoose = require("mongoose");
var Book = require("./app/models/book");
var Genre = require("./app/models/genre");
var Shelf = require("./app/models/shelf");
var Settings = require("./app/models/settings");
var User = require("./app/models/user");

var port = process.env.PORT || 8333;

var dropCollection = function(model){
    return model.collection.drop();
}
//let connection = mongoose.connect(config.database);

// Or using promises
mongoose.connect(config.database).then(
  () => { 
        console.log("connected");

        dropCollection(Book)
        .then(_ => dropCollection(Genre))
        .then(_ => dropCollection(Shelf))
        .then(_ => dropCollection(Settings))
        .then(_ => dropCollection(User))
        .then(_ => {
            console.log("dropped existing collections..");
            process.exit(0);
        });
        
   },
  err => { /** handle initial connection error */ }
);



