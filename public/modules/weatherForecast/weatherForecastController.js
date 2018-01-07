(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.controller('forecastController', forecastController);

	// Manual Dependency injection
	forecastController.$inject = ['$rootScope', '$scope', 'cityService', 'forecast'];

  function forecastController($rootScope, $scope, cityService, forecast) {
	  
    $rootScope.page = 'forecast';
    $scope.city = cityService.city;
      
    $scope.getCurrentWeather = function(city) {
        if (city){
            var params = {q: city,
                          units: 'metric'
                         };
            forecast.weatherNow(params).then(onSuccess);
        }
        
        function onSuccess(weatherData){
            // set sunrise and sunset
            $scope.sunrise = weatherData.sys.sunrise;
            $scope.sunset = weatherData.sys.sunset;
            // get the timeDiff
            var timeDiff = calculateDayLength($scope.sunrise,$scope.sunset);
            $scope.hourDiff = timeDiff.hourDiff;
            $scope.minuteDiff = timeDiff.minuteDiff;
        }
    }
    
    function calculateDayLength(sunriseInMs,sunsetInMs){
        // calculate the day length
        var timeDiffInMs = sunsetInMs-sunriseInMs;
        var minutes = Math.floor(timeDiffInMs/ 60);
        var hourDiff = Math.floor(minutes / 60);
        var minuteDiff = minutes % 60;
        var timeDiff = {hourDiff: hourDiff,
                        minuteDiff: minuteDiff};
        return timeDiff;
    }
      
    $scope.getForecast = function(city){
        if (city){
            $scope.getCurrentWeather(city);
            cityService.detailedPage = null;

            var params = {q: city,
                          units: 'metric',
                          cnt: 6};

            $scope.weatherForecast = null;
            forecast.longForecast(params).then(onSuccess/*,onFail*/);
        }
        
        function onSuccess(weatherData){
          $scope.weatherForecast = weatherData;
          cityService.weatherForecast = weatherData;
          $scope.city = city;
          cityService.city = city;
          $scope.myCity = city;
        };
        /*function onFail(error){
        };*/
    };
      
    $scope.getForecast($scope.city);
    
    
    $scope.convertToDate = function(dt){
        return new Date(dt*1000);
    }; 
    
    $scope.getDetailedForecast = function(index){
      cityService.detailedPage = index;
      $scope.detailedPage = index;
      $scope.lastIndex = cityService.weatherForecast.list.length-1;
      var date = $scope.convertToDate(cityService.weatherForecast.list[index].dt);
      var mainDay = date.getDate();
      
      var params = {q: $scope.city,
                    units: 'metric'};
                    
      $scope.detailedWeatherForecast = null;
      //forecast.shortForecast(params).then(onSuccess/*,onFail*/);
      forecast.getShortForecast(params).then(onSuccess)
      
      function onSuccess(weatherData){
        var detailedWeatherData = [];
        //console.log(weatherData)
        for (var i=0;i<weatherData.list.length;i++) {
          var date = $scope.convertToDate(weatherData.list[i].dt);
          var day = date.getDate();
          if (day == mainDay){
            detailedWeatherData.push(weatherData.list[i]);
          }   
        }  
        $scope.detailedWeatherForecast = detailedWeatherData;      
      };
        
    };
    
    $scope.changeDetailedPage = function(page){
      var newPage = Number(cityService.detailedPage)+Number(page); 
      if (newPage >= 0 && newPage < cityService.weatherForecast.list.length) {
        $scope.getDetailedForecast(Number(cityService.detailedPage)+Number(page));
      }
    }
  };
}());
