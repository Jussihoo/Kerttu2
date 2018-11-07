(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.component('graphComponent', {
            templateUrl: 'modules/graphComponent/graphComponent.html',
            controller: graphComponentController,
            controllerAs: 'vm'
        });
    
        // Manual Dependency injection
	   graphComponentController.$inject = ['$scope', 'ruuvi', 'constants', 'graphService'];
    
        function graphComponentController($scope, ruuvi, constants, graphService) {
            var vm = this;
            
            // create chart and set chart options
            vm.chart = Highcharts.chart('container', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Temperature'
                },

                subtitle: {
                    text: 'Source: Kerttu'
                },

                yAxis: {
                    title: {
                        text: '°C degrees'
                    }
                },
                xAxis: {
                    type: 'datetime',
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        }
                    }
                },
                tooltip: {
                    valueDecimals: 1    
                },
                
                series: [{
                    data: [],
                    zones: [
                            {
                                value: 0,
                                color: '#7cb5ec'
                            },
                            {
                                value: 100,
                                color: '#FF0000'
                            }
                           ],
                }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });
            
            vm.convertDateToUTC = function(dateString)  {
                var date = new Date(dateString);
                var utcTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                                       date.getUTCDate(), date.getUTCHours(),
                                       date.getUTCMinutes(), date.getUTCSeconds());
                return utcTime;
            }
            
            vm.setDataSeries = function(type, devLoc, device, hours, startDate, endDate){
                // set the data series
                var loc = (devLoc == constants.RUUVITAG_LOCATION_OUTSIDE? "Outdoor " : "Downstairs "); 
                vm.chart.setTitle({text: loc + type});
                
                var yTitle = "";
                switch(type) {
                    case constants.TYPE_TEMPERATURE:
                        yTitle = "°C degrees"; 
                        break;
                    case constants.TYPE_PRESSURE:
                        yTitle = "hPa";
                        break;
                    case constants.TYPE_HUMIDITY:
                        yTitle = "%";
                        break;
                    case constants.TYPE_BATTERY:
                        yTitle = "millivolts";
                        break;
                }
                vm.chart.yAxis[0].axisTitle.attr({text: yTitle});
                vm.chart.series[0].update({name: type});

                var params = {type: type,
                      hours: hours,
                      startDate: startDate,
                      endDate: endDate,
                      device: device,
                      devLoc: devLoc};
        
                ruuvi.getAll(params).then(onAllSuccess, onAllError); // Get data from the server

                function onAllSuccess(weatherData){
                    var dataArray = [];
                    var utcTime;
                    
                    if (weatherData.temperature !== undefined && weatherData.temperature.length !== 0) {
                        var temp;
                        for(var i=0;i<weatherData.temperature.length;i++) {
                            temp = ruuvi.calibrateTemperature(weatherData.temperature[i].temperature);
                            utcTime = vm.convertDateToUTC(weatherData.temperature[i].timestamp);
                            dataArray.push({x: utcTime, y: temp});
                        }
                    }
                    else if(weatherData.pressure !== undefined && weatherData.pressure.length !== 0) {
                        var pressure;
                        for(var i=0;i<weatherData.pressure.length;i++) {
                            pressure = ruuvi.calibratePressure(weatherData.pressure[i].pressure);
                            utcTime = vm.convertDateToUTC(weatherData.pressure[i].timestamp);
                            dataArray.push({x: utcTime, y: pressure});   
                        }
                    }
                    else if(weatherData.humidity !== undefined && weatherData.humidity.length !== 0) {
                        var humidity;
                        for(var i=0;i<weatherData.humidity.length;i++) {
                            humidity = weatherData.humidity[i].humidity;
                            utcTime = vm.convertDateToUTC(weatherData.humidity[i].timestamp);
                            dataArray.push({x: utcTime, y: humidity});
                        }
                    }
                    else if(weatherData.battery !== undefined && weatherData.battery.length !== 0) {
                        var battery;
                        for(var i=0;i<weatherData.battery.length;i++) {
                            battery = weatherData.battery[i].voltage;
                            utcTime = vm.convertDateToUTC(weatherData.battery[i].timestamp);
                            dataArray.push({x: utcTime, y: battery}); 
                        }
                    }  
                    else {
                        //console.info("I got no data");
                    }
                    vm.chart.series[0].setData(dataArray, true);
                };

                function onAllError(err){
                    console.warn(err);
                }
            };
            
            // add latest measurement to the graph and re-draw
            // if the current graph is showing measurement, which was now received
            vm.addNewTempPoint = function(weatherObject) {
                // check if current graph is of same data
                if(weatherObject.device == graphService.device &&
                   weatherObject.devLoc == graphService.devLoc ) {
                        // device and location matches
                        var data = null;
                        var timestamp = vm.convertDateToUTC(new Date(weatherObject.temperature.timestamp).toUTCString());
                        if (graphService.type == constants.TYPE_TEMPERATURE) {
                            data = weatherObject.temperature.temperature; 
                        }
                        else if (graphService.type == constants.TYPE_PRESSURE) {
                            data = weatherObject.pressure.pressure;
                        }
                        else if (graphService.type == constants.TYPE_HUMIDITY) {
                            data = weatherObject.humidity.humidity;
                        }
                        else if (graphService.type == constants.TYPE_BATTERY) {
                            data = weatherObject.battery.voltage;
                        }
                    console.log( "yyy " + data);
                    console.dir(weatherObject);
                        vm.chart.series[0].addPoint({
                                                        x: timestamp,
                                                        y: data
                                                    }, false, false);
                        vm.chart.redraw();
                }
            }
            
            // predefined graph button has been pressed, re-draw graph
            $scope.$watch(function () {
                return graphService.hours;
            }, function (hours) {
                if (hours != 0) {
                    vm.setDataSeries(graphService.type, graphService.devLoc, graphService.device,
                                     hours, null, null);
                }
            });
            
            // Date range has been changed, re-draw graph
            $scope.$watch(function () {
                return graphService.dateRange;
            }, function (dateRange) {
                if(dateRange.start != null && dateRange.end != null){
                    graphService.hours = 0;
                    vm.setDataSeries(graphService.type, graphService.devLoc, graphService.device,
                                     null, dateRange.start, dateRange.end);
                }
            });
            
            // new measurement has been received from server through socket
            $scope.$watch(function () {
                return graphService.newWeatherMeasurement;
            }, function (weatherObject) {
                if(weatherObject) {
                    vm.addNewTempPoint(weatherObject);
                }
            });
        }
        
}());