/* example pageview.js */
var nools = require('nools');
var _ = require("lodash");
var declare = require("declare.js");

//flow 
var flow = nools.compile(__dirname + '/rules.nools');


var Person = flow.getDefined('Person');
var skill = flow.getDefined('skill');
var Position = flow.getDefined('position');
var personPos = flow.getDefined('personPos');
var Result = flow.getDefined('Result');

var getpositionPersons = flow.getDefined('getpositionPersons');



var session = flow.getSession();

var result = new Result();
session.assert(result);

session.assert(new Position('WEb',[{name: 'node',score :5},{name: 'php',score :7},{name: 'html',score :1}],"student",4));


var person2 = new Person({
    name: 'aaa',
    age: 9,
});
session.assert(person2);
session.assert(new skill(person2.id,'node', 10));
session.assert(new skill(person2.id,'experience', 10));
session.assert(new skill(person2.id, 'php', 10));
session.assert(new skill(person2.id, 'html', 10));

var person1  = new Person({
    name: 'kjhgjk',
    age: 9,
});

session.assert(person1);
session.assert(new skill(person1.id,'node', 1));
session.assert(new skill(person1.id, 'php', 1));
session.assert(new skill(person1.id, 'html', 10));

var start = Date.now();

// session.on("fire", function (ruleName) {
//     console.log(ruleName);
// });
session.match(function(err){
    if(err){
        console.error(err.stack);
    }else{

          var persones = session.getFacts(Person);
            var skills = session.getFacts(skill);
            var positions = session.getFacts(Position);
            var personPos = session.getFacts(personPos);
             console.log("personPos " + personPos);
            
             console.log(persones);
            console.log(skills);
            console.log("positions"+positions);
        console.log("done");
    }
})

