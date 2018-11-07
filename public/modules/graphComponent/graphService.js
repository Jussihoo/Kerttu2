(function() {

	'use strict';
    
    angular
    .module('kerttuApp')
        .service('graphService', graphService);
    
     // Manual Dependency injection
    graphService.$inject = ['constants'];
                 
    function graphService(constants){
        this.newTemperatureValue;
        this.dateRange = {start: null, end: null};
        this.device = constants.RUUVITAG;
        this.devLoc = constants.RUUVITAG_LOCATION_OUTSIDE;
        this.type = constants.TYPE_TEMPERATURE;
        this.hours = 12;
    };
}());