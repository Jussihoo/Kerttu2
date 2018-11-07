// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose	   = require('mongoose');

// configuration ===========================================
    
// config files
// Require database configuration
var db = require('../server/config/db');

// set our port
var port = process.env.PORT || 8041; 

// connect to your mongoDB database 
mongoose.connect(db.url, {useNewUrlParser: true});

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + "/../public")); 

// routes ==================================================
require('../server/routes/mainRouter')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:3000
var server = app.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// ************************************
// start a supervision timer for ruuvitags
var ruuvitagSupervision = require('../server/commons/ruuvitagSupervision');
ruuvitagSupervision.startSupervision();
// ************************************

// ************************************
// start socket IO connection between server and clients
var socketComms = require('../server/commons/socketComms');
var socCom = new socketComms.handleIOComms(server);
socCom.makeConnection();
// ************************************

// expose app
exports = app;
// expose server
module.exports.socCom = socCom;
