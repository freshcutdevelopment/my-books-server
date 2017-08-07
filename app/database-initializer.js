var Settings = require("./models/settings");
var path = require("path");
var appDir = path.dirname(require.main.filename);
var booksSeedFile = appDir + "/seeds/books.json";
var genresSeedFile = appDir + "/seeds/genres.json";
var shelvesSeedFile = appDir + "/seeds/shelves.json";
var usersSeedFile = appDir + "/seeds/users.json";
var Book = require("./models/book");
var Genre = require("./models/genre");
var Shelf = require("./models/shelf");
var Settings = require("./models/settings");
var User = require("./models/user");
var Promise = require("bluebird");
var _ = require("lodash");
var fs = Promise.promisifyAll(require("fs"));

function DatabaseInitializer() {}

DatabaseInitializer.prototype.initializeSettings = function() {
  console.log("initializing database");
  let promise = Settings.findOne({ key: "database-inititialized" });
  promise.then(setting => {
    if (!setting || !setting.value) {
      this.seedDatabase();
    }
  });
};

DatabaseInitializer.prototype.seedDatabase = function() {
  console.log("seeding database");
  let setting = new Settings();

  setting.key = "database-inititialized";
  setting.value = true;

  let bookGenres = [];

  let genres = this.loadFromSeedFile(genresSeedFile, Genre)
    .then(savedGenres => {
        bookGenres = savedGenres;
        return this.loadFromSeedFile(usersSeedFile, User);
    })
    .then(savedUsers  => this.seedBooks(bookGenres, savedUsers))
    .then(_ => this.loadFromSeedFile(shelvesSeedFile, Shelf))
    .then(_ => {
      console.log("successfully initialized");
      setting.save();
    });

  return genres;
};

DatabaseInitializer.prototype.seedBooks = function(genres, users) {

  return fs.readFileAsync(booksSeedFile, "utf8").then(data => {
    let booksJson = JSON.parse(data);

    let promises = [];

    booksJson.forEach(bookJson => {
      let book = new Book(bookJson);

      switch (book.title) {
        case "War and Peace":
          book.genre = genres.find(g => g.name === "Drama");
          break;
        case "Oliver":
          book.genre = genres.find(g => g.name === "Drama");
          break;
        case "Charlie and the Chocolate Factory":
          book.genre = genres.find(g => g.name === "Childrens");
          break;
      }

      promises.push(book.save());
    });

    return Promise.all(promises);
  });
};

DatabaseInitializer.prototype.loadFromSeedFile = function(seedFile, modelType) {
  return fs.readFileAsync(seedFile, "utf8").then(data => {
    let seedDataJson = JSON.parse(data);

    let promises = [];
    seedDataJson.forEach(seed => {
      let seedModel = new modelType(seed);
      let result = seedModel.save();
      promises.push(result);
    });

    return Promise.all(promises);
  });
};

module.exports = new DatabaseInitializer();
