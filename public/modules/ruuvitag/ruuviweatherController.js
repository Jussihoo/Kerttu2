(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.controller('ruuviweatherController', ruuviweatherController);

	// Manual Dependency injection
	ruuviweatherController.$inject = ['$rootScope','$scope', 'ruuvi','socketFactory', 'constants', 'graphService'];

  function ruuviweatherController($rootScope, $scope, ruuvi, socketFactory, constants, graphService) {
      
    $rootScope.page = 'weather';
	 
    // socket handling. Server sends data in realtime when it receives it  
    socketFactory.on('pushWeatherData', handleSocketData);
      
    function handleSocketData(data) {
        //console.log("got weather data from socket");
        var freshWeatherData = JSON.parse(data);      
        if (freshWeatherData.device && freshWeatherData.device == constants.RUUVITAG){
          // handle actual weather data
          if (!freshWeatherData.devLoc) {
            freshWeatherData.devLoc = constants.RUUVITAG_LOCATION_UNKNOWN; 
          }
          var weatherFragment = {
                                    temperature: {temperature: null,timestamp:null},
                                    humidity: {humidity: null},
                                    pressure: {pressure: null},
                                    battery: {voltage: null},
                                    device: constants.RUUVITAG,
                                    devLoc: freshWeatherData.devLoc
                                }; // init

          if (freshWeatherData.temperature !== undefined) {
            weatherFragment.temperature.temperature = ruuvi.calibrateTemperature(freshWeatherData.temperature);
            weatherFragment.temperature.timestamp = freshWeatherData.time;
          }
          if (freshWeatherData.humidity !== undefined){
            weatherFragment.humidity.humidity = freshWeatherData.humidity;
          }
          if (freshWeatherData.pressure !== undefined){
            weatherFragment.pressure.pressure = ruuvi.calibratePressure(freshWeatherData.pressure);
          }
          if (freshWeatherData.battery !== undefined){
            weatherFragment.battery.voltage = freshWeatherData.battery;
          }
            
          // update UI
          switch(freshWeatherData.devLoc){
            case constants.RUUVITAG_LOCATION_OUTSIDE:
                  $scope.outside = weatherFragment;
                  outsideTempGauge.value = weatherFragment.temperature.temperature;
                  outsideHumidityGauge.value = weatherFragment.humidity.humidity;
                  outsidePressureGauge.value = weatherFragment.pressure.pressure;
                  break;
            case constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS:
                  $scope.downstairs = weatherFragment;
                  insideTempGauge.value = weatherFragment.temperature.temperature;
                  insideHumidityGauge.value = weatherFragment.humidity.humidity;
                  insidePressureGauge.value = weatherFragment.pressure.pressure;
                  break;
            case constants.RUUVITAG_LOCATION_INSIDE_UPSTAIRS:
                  $scope.upstairs = weatherFragment; 
                  break;
          }
            
          // indicate to graphComponent that a new weather measurement has been received
          graphService.newWeatherMeasurement = weatherFragment;
        }
    };
    
      
    $scope.getAllData = function(devLoc, hours){
        var params = {type: 'all',
                      hours: hours,
                      startDate: null,
                      endDate: null,
                      device: constants.RUUVITAG,
                      devLoc: devLoc};
        
        ruuvi.getAll(params).then(onAllSuccess, onAllError); // Get data from the server
        
        function onAllSuccess(weatherData){
            if(hours === 0) {
                if (weatherData.temperature.devLoc == constants.RUUVITAG_LOCATION_OUTSIDE){
                    $scope.outside = weatherData;
                    outsideTempGauge.value = ruuvi.calibrateTemperature(weatherData.temperature.temperature);
                    outsideHumidityGauge.value = weatherData.humidity.humidity;
                    outsidePressureGauge.value = ruuvi.calibratePressure(weatherData.pressure.pressure);
                }
                else if (weatherData.temperature.devLoc == constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS){
                    $scope.downstairs = weatherData;
                    insideTempGauge.value = ruuvi.calibrateTemperature(weatherData.temperature.temperature);
                    insideHumidityGauge.value = weatherData.humidity.humidity;
                    insidePressureGauge.value = ruuvi.calibratePressure(weatherData.pressure.pressure);
                } 
                else if (weatherData.temperature.devLoc == constants.RUUVITAG_LOCATION_INSIDE_UPSTAIRS){
                    $scope.upstairs = weatherData;    
                }
                else {
                    console.info("I got data from unknown ruuvitag. Location: " + weatherData.temperature.devLoc );
                }
            }
        };
        
        function onAllError(err){
            console.warn(err);
        }
          
    };
      
    var hours = 0; // Get only latest measurements
    $scope.getAllData(constants.RUUVITAG_LOCATION_OUTSIDE,hours); // get the last measurements for outside
    $scope.getAllData(constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS,hours); // get the last measurements for inside downstairs
    //$scope.getAllData(constants.RUUVITAG_LOCATION_INSIDE_UPSTAIRS,hours); // get the last measurements for inside upstairs
    
    $scope.convertToDate = function(dt){
        return new Date(dt);
    }; 
      
    $scope.fixVoltage = function(voltage){
        return voltage/1000;
    }
    
  };
}());