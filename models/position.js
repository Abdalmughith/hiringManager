var positionSchema = new mongoose.Schema({
	title : String, 
	education : String,
	experience : Number,
    skills:[{name: String,score :Number}],
    



});


module.exports = mongoose.model('position', positionSchema);

