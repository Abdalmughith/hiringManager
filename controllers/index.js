var express = require('express'),
	router = express.Router();

router.get('/', function(req, res) {
	res.render("index", {
		title: "aaa"
	});
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

router.get('/cv', function(req, res) {

	Models.person.find({}, function(err, data) {
		if (err)
			return res.json(err);
		return res.json(data);

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
// router.use('/test', require('./test'));


module.exports = router;