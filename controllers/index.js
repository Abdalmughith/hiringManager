var express = require('express'),
	router = express.Router();
var nools = require('nools');
router.get('/', function(req, res) {
	res.render("main", {
		alertMessage: 'initialize Session Done !'

	});
});


router.post('/initializeSession', function(req, res) {

	var flow = nools.compile(__dirname + '/rules.nools');
	var Person = flow.getDefined('Person');
	var skill = flow.getDefined('skill');
	var Position = flow.getDefined('position');
	var Result = flow.getDefined('Result');
	var session = flow.getSession();
	var result = new Result();
	session.assert(result);

	console.log("post initializeSession");
	
	res.status(200).send({msg:"initializeSession"});
	
});



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

router.get('/assertCv', function(req, res) {
	Models.person.find({}, function(err, data) {
		if (err)
			return res.json(err);


		return res.render('main', {
			alertMessage: ""
		});

	})

});


router.get('/addPosition', function(req, res) {
	return res.render('addPosition', {
		skills: ['php', 'node', 'html']
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
		return res.json(position);
	});
});
router.get('/addCv', function(req, res) {
	return res.render('addCv', {
		skills: ['php', 'node', 'html']
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


module.exports = router;