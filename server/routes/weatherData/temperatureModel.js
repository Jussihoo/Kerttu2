var mongoose = require('mongoose');
mongoose.Promise = Promise;

// Define Schema
var temperatureSchema = new mongoose.Schema({
	device: {type: Number},
	devLoc: {type: Number, default: 99},
    temperature: {type: Number },
	timestamp: {type: Date, default: Date.now}
});

// Export mongoose model based on schema
module.exports = mongoose.model('Temperature', temperatureSchema);
