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
            getAll: getAllData
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
  };
}());