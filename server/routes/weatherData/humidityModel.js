var mongoose = require('mongoose');
mongoose.Promise = Promise;

// Define Schema
var humiditySchema = new mongoose.Schema({
	device: {type: Number},
	devLoc: {type: Number, default:99},
    humidity: {type: Number },
	timestamp: {type: Date, default: Date.now}
});

// Export mongoose model based on schema
module.exports = mongoose.model('Humidity', humiditySchema);