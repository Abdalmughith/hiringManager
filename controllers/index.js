var express = require('express'),
	router = express.Router();
var nools = require('nools');
var fs = require('fs');
router.get('/', function(req, res) {
	res.render("main", {
		alertMessage: 'initialize Session Done !'

	});
});

router.get('/result', function(req, res) {
	// console.log(session.getFacts(SkillTemplate));
	Models.position.find({},function(err,positions){
		if(err)
			return res.json(err);
		if(req.query.name){
			session.assert(new getpositionPersons(req.query.name));
			session.match().then(
			  function(){
			  	var  result1 = _.sortBy(result.fired[req.query.name], [function(o) { return o.rank; }]);
			  	result.fired = {};
			      return res.render("result", {
					positions : positions,
					result : result1
				});
			  },
			  function(err){
			    //uh oh an error occurred
			    console.error(err.stack);
			});
		}
		else
			return res.render("result", {
				positions : positions,
				result : []
			});
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

router.get('/cvs', function(req, res) {

	Models.person.find({}, function(err, data) {
		if (err)
			return res.json(err);
		return res.render('cvs', {
			persones: data
		});

	})
});



router.get('/addPosition', function(req, res) {
	return res.render('addPosition', {
		skills: globalConfig.skills
	});
});
router.post('/addPosition', function(req, res) {
	var position = new Models.position({
		title: req.body.title,
		education: req.body.education,
		experience: req.body.experience,
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
		addRoleToFile(position, function(err) {
			if (err)
				return res.json(err);
			session.assert(new Position(position.title, position.education,position.experience,position.skills));
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
		education: req.body.education,
		experience: req.body.experience,
		skills: []
	});
	_.forEach(req.body, function(value, index) {
		if (index != 'name' && index != 'age' && index != 'education' && index != 'experience' &&  value != 0) person.skills.push({
			name: index,
			score: value
		});
	});
	person.save(function(err) {
		if (err)
			return res.json(err);

		var tempPerson = new Person({
			name: person.name,
			age: person.age
		});
		session.assert(tempPerson);
		session.assert(new SkillTemplate(tempPerson.id, 'education', person.education));
		session.assert(new SkillTemplate(tempPerson.id, 'experience', person.experience));
		for (var i = person.skills.length - 1; i >= 0; i--) {
			session.assert(new SkillTemplate(tempPerson.id, person.skills[i].name, person.skills[i].score));
		}
		// var persones = session.getFacts(Person);
		// var skills = session.getFacts(SkillTemplate)
		// console.log(persones);
		// console.log(skills);

		return res.redirect('/');
	});

});


router.get('/test', function(req, res) {
	initialize(function (err) {
		return res.send("ko");
	})
	
});

var addRoleToFile = function(position,cb){
var constraine = [
	        [Position, "pos",  _parse("pos.title == \"%s\"",position.title)],
	        [Person, "c", ""]
		];
	var totalScore = _.sumBy(position.skills, function(o) { return o.score; })  *2;  // /2
	var rankString = '		var rank = (0';
 	var rank = 0;

	var data = _parse('\nrule \"%s\"{\n', position.title);
	data += _parse('	when {\n');
	data += _parse('		pos: position pos.title == \"%s\";\n', position.title);
	data += _parse('		c: Person;\n');
	_.forEach(position.skills,function(skill,index){
		data += _parse('		s%s: skill s%s.personId == c.id && s%s.skillName == pos.skills[%s].name;\n',index,index,index,index);
		rankString += _parse('+ (s%s.score *pos.skills[%s].score)',index,index);
		constraine.push([SkillTemplate,'s'+index,_parse('s%s.personId == c.id && s%s.skillName == pos.skills[%s].name',index,index,index)]);
	});
	data += '	}\n\tthen {\n';
	data += rankString+')/'+totalScore+';\n';
	data += _parse('		assert(new personPos(c.id,pos.id,rank));\n');
	//data += _parse('		console.log(\"%s\");\n',position.title);
	data += _parse('	}\n}\n');

	fs.appendFile(__dirname + '/rules.nools', data, function(err) {
		if (err) return cb(err);

		 flow.rule(position.title, {scope: {isEqualTo: ()=>{}}},constraine, function (facts) {
		 	var rank = 0;
		 	for(i=0;i<globalConfig.skills.length;i++){
		 		if(!facts['s'+i])
		 			break;
		 		else
		 			rank+=facts['s'+i].score;
		 	}
		 	rank /= totalScore;
	        this.assert(new personPos(facts.c.id,facts.pos.id,rank));
	    });



		// flow = nools.compile(data,{name : "A",define: {
	 //        Person: Person,
	 //        position: Position,
	 //        personPos: personPos,
	 //        skill: SkillTemplate
	 //    }});
		// session = flow.getSession();
		// initialize();
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