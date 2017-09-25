var User = require("./models/user");
var Book = require("./models/book");

module.exports = (function() {

  mapBookProperties = (req, book) => {
    book = book || new Book();

    book.title = req.body.title || book.title;
    book.description = req.body.description || book.description;
    book.rating = req.body.rating || book.rating;
    book.genre = req.body.genre || book.genre;
    book.ownACopy = req.body.ownACopy || book.ownACopy;
    book.readDate = req.body.readDate || book.readDate;
    book.read = req.body.read || book.read;
    book.timesRead = req.body.timesRead || book.timesRead;
    book.shelves = req.body.shelves || book.shelves;
    book.status = req.body.status || book.status;

    return book;
  };

  mapUserProperties = (req, user) => {
    user = user || new User();

    user.name = req.body.name || user.name;
    user.first_name = req.body.first_name || user.first_name;
    user.surname = req.body.surname || user.surname;
    user.admin = req.body.admin || user.admin;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.country = req.body.country || user.country;

    return user;
  };

  return {
    mapUserProperties: mapUserProperties,
    mapBookProperties: mapBookProperties
  };

})();
