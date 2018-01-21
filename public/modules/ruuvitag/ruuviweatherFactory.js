(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.factory('ruuvi', ruuvi);

	// Manual Dependency injection
	ruuvi.$inject = ['$http', '$q', 'constants'];

	// Forecast factory implementation
	function ruuvi($http,$q, constants) {

		var factoryObject = {
    
            // data
            
            //public functions
            getTemperature: getTemperatureData,
            getHumidity: getHumidityData,
            getPressure: getPressureData,
            getAll: getAllData,
            calibratePressure: getCalibratedPressure,
            calibrateTemperature: getCalibratedTemperature
		};

	  return factoryObject;
    
    function getTemperatureData(){
        
    };
        
    function getHumidityData(){
        
    };
    
    function getPressureData(){
        
    };
        
    function getAllData(params){
        return _getData(params);
    };
        
    function getCalibratedPressure(pressure){
        return _getCalibPressure(pressure)
    }
        
    function getCalibratedTemperature(temperature){
        return _getCalibTemperature(temperature)
    }
        
    // internal function
    function _getData(params) {
                    
      var deferred = $q.defer();
      $http.get(constants.BASE_URL, {params: params }).then(onDataReceived, onDataError);
      
      return deferred.promise;
      
      ///////////////
      
      function onDataReceived(resp) {
        console.log(resp.data);
        deferred.resolve(resp.data);
      };
      
      function onDataError(err) {
        //console.dir(err);
        deferred.reject(err);
      };
    };
        
    function _getCalibPressure(pressure){
        return pressure+constants.PRESSURE_CALIBRATION_FACTOR;
    }
    
    function _getCalibTemperature(temperature){
        return temperature+constants.TEMPERATURE_CALIBRATION_FACTOR;
    }
  };
}());