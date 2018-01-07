// server/routes/mainRouter.js

var API_BASEPATH 	= 	"/api";
var API_VER_1_URL	= 	API_BASEPATH + "/v1";

// Require .js for each route
var WEATHERDATA_URL = '/weatherData';
var weather = require('./weatherData/routes');

module.exports = function(app) {

	// Server Routes to handle API Calls ========

	// Example routing ===========================
	app.use(API_VER_1_URL + WEATHERDATA_URL, weather);
    
};
