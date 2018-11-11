(function() {

	'use strict';

	angular
    .module('kerttuApp')
        .constant('constants', 
         {
            RUUVITAG: 1,
            RUUVITAG_LOCATION_OUTSIDE: 1,
            RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS: 2,
            RUUVITAG_LOCATION_INSIDE_UPSTAIRS: 3,
            RUUVITAG_LOCATION_UNKNOWN: 256,
            BASE_URL: 'http://localhost:8041/api/v1/weatherData',
            SOCKET_URL: 'http://localhost:8041',
            PRESSURE_CALIBRATION_FACTOR: 8,
            TEMPERATURE_CALIBRATION_FACTOR: -1,
            TYPE_TEMPERATURE: "temperature",
            TYPE_PRESSURE: "pressure",
            TYPE_HUMIDITY: "humidity",
            TYPE_BATTERY: "battery",
            FB_PAGE_URL: "my-facebook-page-url",
            FB_APP_ID: 0
         })
    
}());