# my-books-server
Example Node.js and Express server for the my-books Aurelia sample SPA project (companion to the book [Aurelia in Action](https://www.manning.com/books/aurelia-in-action)).

## Technologies Used
* MongoDB
* NodeJS
* ExpressJS
* JWT (for token based authentication). This is set up in a naive way for demo purposes only with user passwords stored in plain text in MongoDB, so shouldn't be taken directly as an example of how to do this in production.

## How to Use

### Set up the prerequisites
* Download and install [Node.js](https://nodejs.org/en/download/package-manager/)
* Download and install [MongoDB](https://docs.mongodb.com/manual/installation/)
* Install NPM packages `npm install`


### Configuration ###
Configuration for variables such as the database and whether authentication is enabled is stored in the <code>/config.js </code> file.

```js
module.exports = {

    'secret': 'my-books-auth-key', //token based auth key.
    'database': 'mongodb://localhost/my-books', //MongoDB database
    'authEnabled': false //toggle to enable or disable auth
};
```

### Initialize the database 
You can initialize the my-books MongoDB database by running the NPM command: `npm run database`. This creates the new my-books database
if it does not exist and starts MongoDB on the default port. The database is now ready to receive data.

### Initialize the server
You can initialize the simple Express.js based server by running the `npm run dev` which sets up the routes and initializes the application. The first time that the application runs the database will be populated with default books, genres, and shelves.

### Re-seeding the database
This sample REST API is a work in progress. As such, we'll be making adjustments to the schema and content of the MongoDB instance. You can re-build the data-set based by performing the following steps:
- Pull the latest version of the repo to access the most recent seed files.
- Run the npm command `npm run reset-database` to clear the existing collections
- Re run the API with `npm run dev` which will re-initialize the data-set from the latest seed files.

### Using the REST API
You can see which REST commands are available by loading the my-books [postman script](https://github.com/freshcutdevelopment/my-books-server/blob/master/my-books.postman_collection.json):

![My books server REST API screenshot](https://sean-hunter.io/wp-content/uploads/2017/06/my-books-sample-server.png "My books server REST API screenshot")
