var express = require('express'),
	router = express.Router();
var nools = require('nools');
var	fs = require('fs');
router.get('/', function(req, res) {
	res.render("main", {
		alertMessage: 'initialize Session Done !'

	});
});


var flow = nools.compile(__dirname + '/rules.nools');
var Person = flow.getDefined('Person');
var skill = flow.getDefined('skill');
var Position = flow.getDefined('position');
var Result = flow.getDefined('Result');
var session = flow.getSession();
var result = new Result();
session.assert(result);


router.get('/positions', function(req, res) {

	Models.position.find({}, function(err, data) {
		if (err)
			return res.json(err);
		return res.render('positions', {
			positions: data
		});

	})
});

router.get('/cvs', function(req, res) {

	Models.person.find({}, function(err, data) {
		if (err)
			return res.json(err);
		return res.render('cvs', {
			persones: data
		});

	})
});

// router.get('/assertCv', function(req, res) {
// 	Models.person.find({}, function(err, data) {
// 		if (err)
// 			return res.json(err);


// 		return res.render('main', {
// 			alertMessage: ""
// 		});

// 	})

// });


router.get('/addPosition', function(req, res) {
	return res.render('addPosition', {
		skills: globalConfig.skills
	});
});
router.post('/addPosition', function(req, res) {
	var position = new Models.position({
		title: req.body.title,
		skills: []
	});

	_.forEach(req.body, function(value, index) {
		if (Array.isArray(value)) position.skills.push({
			name: _.replace(index, 'skill_', ''),
			score: value[1]
		});
	});
	position.save(function(err) {
		if (err)
			return res.json(err);
		addRoleToFile(position,function(err){
			if(err)
				return res.json(err);
			session.assert(new Position(position.title,position.skills));
			return res.redirect('./positions');

		});
	});

});
router.get('/addCv', function(req, res) {
	return res.render('addCv', {
		skills: globalConfig.skills
	});
});
router.post('/addCv', function(req, res) {
	var person = new Models.person({
		name: req.body.name,
		age: req.body.age,
		skills: []
	});
	_.forEach(req.body, function(value, index) {
		if (index != 'name' && index != 'age' && value != 0) person.skills.push({
			name: index,
			score: value
		});
	});
	person.save(function(err) {
		if (err)
			return res.json(err);
		return res.json(person);
	});

});


router.get('/test', function(req, res) {
	res.render("test", {
		// title: "aaa"
	});
});

router.post('/test', function(req, res) {
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
});
// router.use('/test', require('./test'));

var addRoleToFile = function(position,cb){
	var totalScore = _.sumBy(position.skills, function(o) { return o.score; });
	var rank = '		var rank = (0';

	var data = _parse('\nrule \"%s\"{\n',position.title);
	data += _parse('	when {\n');
	data += _parse('		pos: position pos.title == \"%s\";\n',position.title);
	data += _parse('		c: Person;\n');
	_.forEach(position.skills,function(skill,index){
		data += _parse('		s%s: skill s%s.personId == c.id && s%s.skillName == pos.skill[%s].name;\n',index,index,index,index);
		rank += _parse('+ (s%s.score *pos.skills[%s].score)',index,index);
	});
	data += '	}\n\tthen {\n';
	data += rank+')/'+totalScore+';\n';
	data += _parse('		assert(new personPos(c.id,pos.id,rank));\n');
	data += _parse('	}\n}\n');

	fs.appendFile(__dirname + '/rules.nools', data, function (err) {
		if (err) return cb(err);



	  	return cb(null);
	});
}

function _parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}


module.exports = router;