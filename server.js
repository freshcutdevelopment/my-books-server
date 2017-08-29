var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var DatabaseInitializer = require("./app/database-initializer.js");
var mongoose = require("mongoose");
var Promise = require("bluebird");
mongoose.promise = Promise;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("./config");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8333;

let connection = mongoose.connect(config.database);

var auth = require("./app/auth.js");

//======================================
//ROUTING SETUP
//======================================
var router = express.Router();

app.use(express.static("public")); //Serve static files out of the public route.

 app.use(function(req, res, next) {
    req.getRoot = function() {
      return req.protocol + "://" + req.get('host');
    }
    return next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, authorization"
  );

  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

require("./unsecured-routes")(router); //Add the unsecured routes before applying the auth middleware.

if (config.authEnabled) {
  require("./token-middleware")(router);
}

require("./secured-routes")(app, router);

app.use("/api", router); //All API routes should sit under the /api route prefix.

app.listen(port, () => {
  DatabaseInitializer.initializeSettings();
});

console.log("my-books server initialized. " + port);
