
angular.module('kerttuApp', ['ngRoute'])

    //Routes
    .config(routeMachine);

    routeMachine.$inject = ['$routeProvider'];
        
    function routeMachine($routeProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'modules/ruuvitag/ruuviweather.html',
            controller: 'ruuviweatherController'
        })
        .when('/weather', {
            templateUrl: 'modules/ruuvitag/ruuviweather.html',
            controller: 'ruuviweatherController'
        })
        .when('/forecast', {
            templateUrl: 'modules/weatherForecast/forecast.html',
            controller: 'forecastController'
	    })
    }
