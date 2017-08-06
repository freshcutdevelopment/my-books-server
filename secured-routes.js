var Book = require("./app/models/book");
var Genre = require("./app/models/genre");
var Shelf = require("./app/models/shelf");
var Settings = require("./app/models/settings");
var User = require("./app/models/user");
var requestMapper = require('./app/request-mapper');

module.exports = function(app, router) {
  ///*********************** ///
  ///User management routes ///
  ///**********************///
  router
    .route("/users")
    .post((req, res) => {
      let user = requestMapper.mapUserProperties(req);

      user.save(err => {
        if (err) res.send(err);

        res.json(user);
      });
    })
    .get((req, res) => {
      User.find((err, users) => {
        if (err) res.send(err);

        res.json(users);
      });
    });

  router
    .route("/users/:name")
    .get((req, res) => {
      User.findOne({ name: req.params.name }, (err, user) => {
        if (err) res.send(err);
        res.json(user);
      });
    })
    .put((req, res) => {
      User.findOne({ name: req.params.name }, (err, user) => {
        if (err) res.send(err);

        requestMapper.mapUserProperties(req, user);

        user.save(err => {
          if (err) res.send(err);

          res.json(user);
        });
      });
    })
    .delete((req, res) => {
      User.remove(
        {
          name: req.params.name
        },
        (err, user) => {
          if (err) res.send(err);

          res.json({ message: "Successfully deleted" });
        }
      );
    });

  ///*********************** ///
  ///Book management routes ///
  ///**********************///

  router
    .route("/books")
    .post((req, res) => {
      let book = requestMapper.mapBookProperties(req);

      book.save(err => {
        if (err) res.send(err);

        res.json(book);
      });
    })
    .get((req, res) => {
      Book.find((err, books) => {
        if (err) res.send(err);

        res.json(books);
      });
    });

  router.route("/booksjsonp").get((req, res) => {
    Book.find((err, books) => {
      if (err) res.send(err);

      res.jsonp(books);
    });
  });

  router
    .route("/book/:book_id")
    .get((req, res) => {
      Book.findOne({ _id: req.params.book_id }, (err, book) => {
        if (err) res.send(err);
        res.json(book);
      });
    })
    .put((req, res) => {
      Book.findById(req.params.book_id, (err, book) => {
        if (err) res.send(err);

        requestMapper.mapBookProperties(req, book);

        book.save(err => {
          if (err) res.send(err);

          res.json(book);
        });
      });
    })
    .delete((req, res) => {
      Book.remove(
        {
          _id: req.params.book_id
        },
        (err, book) => {
          if (err) res.send(err);

          res.json({ message: "Successfully deleted" });
        }
      );
    });

  router.route("/genres").get((req, res) => {
    Genre.find((err, genres) => {
      if (err) res.send(err);

      res.json(genres);
    });
  });

  router.route("/shelves").get((req, res) => {
    Shelf.find((err, shelves) => {
      if (err) res.send(err);

      res.json(shelves);
    });
  });

  router.route("/users").get((req, res) => {
    User.find((err, users) => {
      if (err) res.send(err);

      res.json(users);
    });
  });
};
