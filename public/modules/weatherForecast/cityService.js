(function() {

	'use strict';
    
    angular
    .module('kerttuApp')
        .service('cityService', cityService);
                 
    function cityService(){
        this.city = 'Villilä';
        this.detailedPage = 0;
        this.weatherForecast = null;
    };
}());