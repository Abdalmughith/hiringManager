var personSchema = new mongoose.Schema({
	name : String, 
	age : Number,
	education : String,
	experience : Number,
	skills:[{name: String,score :Number}],
    

});


module.exports = mongoose.model('person', personSchema);
