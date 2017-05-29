module.exports.makePayload = (event,data) => {
	return JSON.stringify({
		event : event,
		data : data
	});
}