(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.factory('forecast', forecast);

	// Manual Dependency injection
	forecast.$inject = ['$http', '$q', 'forecastConstants'];

	// Forecast factory implementation
	function forecast($http,$q, forecastConstants) {

		var factoryObject = {
    
            // data
            forecastData: undefined,
            detailedForecastData: undefined,
      
            //public functions
            longForecast: getLongForecast,
            shortForecast: getShortForecast,
            getShortForecast: getDetailedForecastData,
            weatherNow: getCurrentWeather
		};

	  return factoryObject;
  
    // Get weather forecast for x days. It's possible to get for 16 days max.
    // This API is not free so let's see how well and for how long it works.
    // If this stops working, then this has to be changed to use the API used
    // in shortForecast and calculate the daily data from the returned information.
    // Then it's possible to have daily forecast, but only for 5 days at max.
    function getLongForecast(params) {
    
      var baseUrl = "http://api.openweathermap.org/data/2.5/forecast/daily";
      factoryObject.detailedForecastData = null;
      
      return _getForecast(baseUrl, params);
    };
    
    // Get detailed weather forecast for x days. Max 5 days. 
    // It returns forecast in 3 hour periods
    function getShortForecast(params) {
      
      var baseUrl = "http://api.openweathermap.org/data/2.5/forecast";
      
      return _getForecast(baseUrl,params);
      
    };
    
    // This returns the current weather.
    // Used mainly for getting the sunset and sunrise info
    function getCurrentWeather(params) {
    
      var baseUrl = "http://api.openweathermap.org/data/2.5/weather";
      
      return _getForecast(baseUrl,params);
      
    };
    
    // this function returns detailed weatherdata from the memory
    // or if not stored in memory from the API
    function getDetailedForecastData(params) {    
      var deferred = $q.defer();
      
      if(factoryObject.detailedForecastData){
        console.log("I have data");
        deferred.resolve(factoryObject.detailedForecastData);
      }
      else {
        console.log("let's get fresh data");
        var baseUrl = "http://api.openweathermap.org/data/2.5/forecast";
        _getForecast(baseUrl,params).then(onSuccess, onError);
      }
      
      return deferred.promise;
      
      /////////////
      function onSuccess(resp) {
        console.log("success");
        console.log(resp);
        factoryObject.detailedForecastData = resp;
        deferred.resolve(resp);
      };
        
      function onError(err) {
        deferred.reject(err);
      };
    }
        
    // internal function
    function _getForecast(baseUrl, params) {
                    
      params['appId'] = forecastConstants.APP_ID;
      
      var deferred = $q.defer();
      $http.get(baseUrl, {params: params }).then(onDataReceived, onDataError);
      
      return deferred.promise;
      
      ///////////////
      
      function onDataReceived(resp) {
        console.log(resp.data);
        deferred.resolve(resp.data);
      };
      
      function onDataError(err) {
        console.dir(err);
        deferred.reject(err);
      };
    };
  };
}());
  
  
  
  
