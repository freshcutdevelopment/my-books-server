var express    = require('express');
var app        = express();   
var bodyParser = require('body-parser');
var Book = require('./app/models/book');
var Genre = require('./app/models/genre');
var Shelf = require('./app/models/shelf');
var Settings = require('./app/models/settings');
var booksSeedFile = __dirname + '/seeds/books.json';
var genresSeedFile = __dirname + '/seeds/genres.json';
var shelvesSeedFile = __dirname + '/seeds/shelves.json';
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.promise = Promise;
var fs = Promise.promisifyAll(require('fs'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8333;

let connection = mongoose.connect('mongodb://localhost/my-books');

//ROUTING SETUP
//======================================
var router = express.Router();  

app.use(express.static('public')); //Serve static files out of the public route.

router.get('/', (req, res) =>{ //Default hello-world route.
    res.json({ message: 'Welcome to the my-books API.' });   
});

router.route('/books')
       .post((req, res) =>{

            let book = app.mapBookProperties(req);

            book.save( (err) => {

                if(err) res.send(err);

                res.json(book);
            });

       })
       .get((req, res) => {

            Book.find((err, books) =>{
                if(err) res.send(err);

                res.json(books);
            });

       });

router.route('/booksjsonp').get( (req, res) => {
     Book.find((err, books) =>{
        if(err) res.send(err);

        res.jsonp(books);
    });
});

router.route('/book/:book_id')
      .get((req, res) => {

        Book.findOne( { '_id': req.params.book_id}, (err, book) => {
            if(err) res.send(err);
            res.json(book);
        });

      })
      .put( (req, res) => {

        Book.findById(req.params.book_id, (err, book) => {
            if(err) res.send(err);

            app.mapBookProperties(req, book);

            book.save( (err) => {

                if(err) res.send(err);

                res.json(book);
            });
        });

      })
      .delete( (req, res) => {
        Book.remove({
            _id: req.params.book_id
        }, (err, book) =>{

            if(err) res.send(err);

            res.json({message: 'Successfully deleted'});
        });
      });

router.route('/genres')
       .get((req, res) => {
            Genre.find((err, genres) =>{
                if(err) res.send(err);

                res.json(genres);
            });
       });

router.route('/shelves')
       .get((req, res) => {
            Shelf.find((err, shelves) =>{
                if(err) res.send(err);

                res.json(shelves);
            });
       });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router); //All API routes should sit under the /api route prefix.

app.listen(port,  () => {
    app.initializeSettings();
});

app.initializeSettings = () => {
    let promise = Settings.findOne({'key': 'database-inititialized'});
    promise.then( (setting) => {
        if(!setting || !setting.value){
            app.seedDatabase();
        }
    });
};

app.seedDatabase = () =>{
  
    let setting = new Settings();

    setting.key = 'database-inititialized';
    setting.value = true;

    let genres = app.loadFromSeedFile(genresSeedFile, Genre)
        .then(savedGenres => app.seedBooks(savedGenres))
        .then( _ => app.loadFromSeedFile(shelvesSeedFile, Shelf))
        .then( _ => {
            console.log("successfully initialized");
            setting.save();
        });

    return genres;
};

app.seedBooks = (genres) => {

   return fs.readFileAsync(booksSeedFile, 'utf8').then( data => {
        let booksJson = JSON.parse(data);
        
        let promises = [];

        booksJson.forEach( (bookJson) => {

            let book = new Book(bookJson);

            switch(book.title){
                case 'War and Peace':  book.genre = genres.find(g => g.name === 'Drama');
                break;
                case 'Oliver' : book.genre = genres.find(g => g.name === 'Drama');
                break;
                case 'Charlie and the Chocolate Factory': book.genre = genres.find(g => g.name === 'Childrens');
                break;
            }
            promises.push(book.save());
        });

        return Promise.all(promises);
    });
}

app.loadFromSeedFile = (seedFile, modelType) => {
    
  return fs.readFileAsync(seedFile, 'utf8')
          .then( data => {
            let seedDataJson = JSON.parse(data);

            let promises = [];
            seedDataJson.forEach((seed) => {
                let seedModel = new modelType(seed);
                let result = seedModel.save();
                promises.push(result);
            });

            return Promise.all(promises);

  });
}

app.mapBookProperties = (req, book) => {
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

console.log('my-books server initialized. ' + port);