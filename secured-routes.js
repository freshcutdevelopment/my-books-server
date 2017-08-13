var Book = require("./app/models/book");
var Genre = require("./app/models/genre");
var Shelf = require("./app/models/shelf");
var Settings = require("./app/models/settings");
var User = require("./app/models/user");
var requestMapper = require('./app/request-mapper');
var Config = require('./config.js');
var auth = require('./app/auth.js');
var BookUtilities = require('./app/book-utilities.js');
var _ = require("lodash");

module.exports = function(app, router) {
  ///*********************** ///
  ///User management routes ///
  ///**********************///

  router.use('/users', (req, res, next) => {
 
    if(Config.authEnabled && (!req.decoded || !auth.getUser(req).admin)){
      return res.status(401).send({ 
                    message: 'You care not authorized to manage users.'
                });
    } 
    else{
      next()
    }
  }, (req, res, next) =>{next()}
  );

  router
    .route("/users")
    .post((req, res) => {
      let user = requestMapper.mapUserProperties(req);

      user.save(err => {
        if (err) res.send(err);
        delete user.password;
        res.json(user);
      });
    })
    .get((req, res) => {
      User.find((err, users) => {
        if (err) res.send(err);
        _.forEach(users, u => {
          delete u._doc.password;
        });

        console.log('users', users);
        res.json(users);
      });
    });

  router
    .route("/users/:name")
    .get((req, res) => {
      User.findOne({ name: req.params.name }, (err, user) => {
        if (err) res.send(err);
        delete user.password;
        res.json(user);
      });
    })
    .put((req, res) => {
      User.findOne({ name: req.params.name }, (err, user) => {
        if (err) res.send(err);

        requestMapper.mapUserProperties(req, user);

        user.save(err => {
          if (err) res.send(err);
          delete user.password;
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
      if(Config.authEnabled) book.userName = auth.getUser(req).name;
      
      book.save(err => {
        if (err) res.send(err);

        res.json(book);
      });
    })
    .get((req, res) => {

      let findHash = {};
      if(Config.authEnabled) findHash["userName"] = auth.getUser(req).name;
      Book.find(findHash, (err, books) => {
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

      let findHash = BookUtilities.getFindHash(req);

      Book.findOne(findHash, (err, book) => {
        if (err) res.send(err);
        res.json(book);
      });
    })
    .put((req, res) => {
      let findHash = BookUtilities.getFindHash(req);
      Book.findOne(findHash, (err, book) => {
        if (err) res.send(err);

        requestMapper.mapBookProperties(req, book);

        book.save(err => {
          if (err) res.send(err);

          res.json(book);
        });
      });
    })
    .delete((req, res) => {
      
      let findHash = BookUtilities.getFindHash(req);
      Book.findOne(findHash, (err, book) => {
        if (err) res.send(err);
        
        if(book){
           Book.remove(findHash, (err, book) => {
              if (err) res.send(err);

              res.json({ message: "Successfully deleted" });
            }
          );
        }
        else{
          res.sendStatus(404); //return a 404 if we can't find a book under this user.
        }
      });
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
};
