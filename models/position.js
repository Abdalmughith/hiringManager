var positionSchema = new mongoose.Schema({
	title : String, 
    skills:[{name: String,score :Number}],
    



});


module.exports = mongoose.model('position', positionSchema);

