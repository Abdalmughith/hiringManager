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
// var mongodbUrl = 'mongodb://nasar:nasar@ds163360.mlab.com:63360/nasar';
var mongodbUrl = 'mongodb://127.0.0.1:27017/hiringManager';

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

var nools = require('nools');

flow = nools.compile(__dirname + '/controllers/rules.nools');
Person = flow.getDefined('Person');
SkillTemplate = flow.getDefined('skill');
Position = flow.getDefined('position');
personPos = flow.getDefined('personPos');
Result = flow.getDefined('Result');
getpositionPersons = flow.getDefined('getpositionPersons');
session = flow.getSession();
result = new Result();
session.assert(result);

initialize = function() {
	Models.person.find({}, function(err, data) {
		if (err)
			return cb(err);
		for (var j = data.length - 1; j >= 0; j--) {
			var person = data[j];
			var tempPerson = new Person({
				name: person.name,
				age: person.age
			});
			session.assert(tempPerson);

			if(person.education)session.assert(new SkillTemplate(tempPerson.id,'education', person.education));
			if(person.education)session.assert(new SkillTemplate(tempPerson.id,'experience', person.experience));
			for (var i = person.skills.length - 1; i >= 0; i--) {
				session.assert(new SkillTemplate(tempPerson.id, person.skills[i].name, person.skills[i].score));
			}
		}

		Models.position.find({}, {
			"skills._id": 0
		}, function(err, positions) {
			if (err)
				return cb(err);
			for (var j = positions.length - 1; j >= 0; j--) {
				session.assert(new Position(positions[j].title, positions[j].skills, positions[j].education, positions[j].experience))
			}
			// var persones = session.getFacts(Person);
			// var skills = session.getFacts(skill);
			// var positions = session.getFacts(Position);
			// console.log(persones);
			// console.log(skills);
			// console.log(positions);
			return ;

		});


	});
}
initialize();




//controllers
app.use(require('./controllers'));


module.exports = app;


