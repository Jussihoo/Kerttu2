(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.component('graphSelectorComponent', {
            templateUrl: 'modules/graphSelComponent/graphSelComponent.html',
            controller: graphSelComponentController,
            controllerAs: 'vm'
        });
    
        // Manual Dependency injection
	    graphSelComponentController.$inject = ['$scope', 'graphService', '$mdDateLocale','$filter', 'constants'];
    
        function graphSelComponentController($scope, graphService, $mdDateLocale,$filter, constants) {
            var vm = this;
            
            vm.disableDatePicker = false;
            vm.disableButton = false;
            
            vm.startDate = null;
            vm.endDate = null;
            vm.measurements = [{loc: constants.RUUVITAG_LOCATION_OUTSIDE,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_TEMPERATURE,
                                name: "Outdoors temperature"},
                               {loc: constants.RUUVITAG_LOCATION_OUTSIDE,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_PRESSURE,
                                name: "Outdoors air pressure"},
                               {loc: constants.RUUVITAG_LOCATION_OUTSIDE,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_HUMIDITY,
                                name: "Outdoors humidity"},
                               {loc: constants.RUUVITAG_LOCATION_OUTSIDE,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_BATTERY,
                                name: "Outdoors battery"},
                               {loc: constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_TEMPERATURE,
                                name: "Downstairs temperature"},
                               {loc: constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_PRESSURE,
                                name: "Downstairs air pressur"},
                               {loc: constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_HUMIDITY,
                                name: "Downstairs humidity"},
                               {loc: constants.RUUVITAG_LOCATION_INSIDE_DOWNSTAIRS,
                                device: constants.RUUVITAG,
                                type: constants.TYPE_BATTERY,
                                name: "Downstairs battery"}
                              ];
            vm.selectedMeasurement = vm.measurements[0];
            
            vm.updateGraph = function(hours) {
                graphService.buttonDisabled = true;
                graphService.datePickerDisabled = true;
                graphService.device = vm.selectedMeasurement.device;
                graphService.devLoc = vm.selectedMeasurement.loc;
                graphService.type = vm.selectedMeasurement.type;
                graphService.hours = hours;
            }
            
            vm.setToday = function(picker){
                if(picker == 0) { // startDate
                    vm.startDate = new Date();
                    vm.startDate.setHours(0,0,0,0);
                    if(vm.endDate != null && vm.startDate.getTime() > vm.endDate.getTime()){
                        vm.startDate = vm.endDate;
                        vm.startDate.setHours(0,0,0,0);
                    }
                    vm.maxDate = vm.endDate;
                }
                else { //endDate
                    vm.endDate = new Date();
                    vm.minDate = vm.startDate;
                }
            }
            
            vm.startDateChanged = function(){
                // finish date can not be earlier than start date
                vm.maxDate = vm.endDate;
            };
            vm.finishDateChanged = function(){
                // start date can not be later than end date
                vm.minDate = vm.startDate;    
            }
            
            vm.getDateRange = function(){
                graphService.datePickerDisabled = true;
                graphService.buttonDisabled = true;
                var startDate = vm.startDate;
                // set endDate by picking only date and ignoring time
                var endDate = vm.endDate;
                endDate.setHours(23,59,59,999);
                console.log(startDate);
                console.log(endDate);
                graphService.device = vm.selectedMeasurement.device;
                graphService.devLoc = vm.selectedMeasurement.loc;
                graphService.type = vm.selectedMeasurement.type;
                graphService.dateRange = {start: startDate.getTime(), end:endDate.getTime()};
            }
            
            vm.typeChanged = function() {
                graphService.hours = 0;
            }
            
            vm.setToday(0);
            vm.setToday(1);
            
            // toggle button
            $scope.$watch(function () {
                return graphService.datePickerDisabled;
            }, function (datePickerDisabled) {
                vm.disableDatePicker = datePickerDisabled;
            });
            
            // toggle button
            $scope.$watch(function () {
                return graphService.buttonDisabled;
            }, function (buttonDisabled) {
                vm.disableButton = buttonDisabled;
            });
        }
        
}());