var express = require('express');
var path = require('path');
var fs = require('fs')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

app = express();

_usersTemp = {};


// DB Connection
mongoose = require('mongoose');
mongoose.Promise = global.Promise;
ObjectId = mongoose.Schema.Types.ObjectId;
var mongodbUrl = 'mongodb://nasar:nasar@ds163360.mlab.com:63360/nasar';
mongoose.connect(mongodbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/*
 log
*/
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false ,limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Packages
_ = require('lodash');
async = require('async');

// models
Models = require('./models');





//controllers
app.use(require('./controllers'));


module.exports = app;


