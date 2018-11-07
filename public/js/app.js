
angular.module('kerttuApp', ['ngRoute','ngMaterial'])

    // configurate the DatePicker's date format
    .config(formatDatePicker)
    // configure Routes
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

    // format the date for the Date picker
    function formatDatePicker($mdDateLocaleProvider){
        $mdDateLocaleProvider.formatDate = function(date) {
            var day = date.getDate();
            var month = date.getMonth()+1;
            var year = date.getFullYear();
            return day + '.' + month + '.' + year;
        }
    }

