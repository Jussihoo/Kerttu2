(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.factory('graphComponentOptions', graphComponentOptions);

	// Manual Dependency injection
	graphComponentOptions.$inject = [];

	// graphComponentOptions factory implementation
	function graphComponentOptions() {

		var factoryObject = {
    
            //public functions
            setChart: setHighChartChart,
            
		};

	  return factoryObject;
  
    // Sets the HighChart
    function setHighChartChart() {
    
        Highcharts.setOptions({
            time: {
                useUTC: false
            },
            lang: {
                loading: "",
                noData: "No data to display"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            }
        });

        // create chart and set chart options
        return Highcharts.chart('graphContainerId', {
            chart: {
                renderTo: 'graphContainerId',
                zoomType: 'x',
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
    };
        
  };
}());