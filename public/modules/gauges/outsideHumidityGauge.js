var outsideHumidityGauge= null;
function initOutsideHumidityGauge() {
    outsideHumidityGauge = new RadialGauge({
        renderTo: 'outsideHumidityGauge',
        title: 'Humidity',
        width: 190,
        height: 190,
        minValue: 0,
        maxValue: 100,
        majorTicks: ['0','10','20','30','40','50','60','70', '80', '90', '100'],
        highlights: [
            { from: 0, to: 40, color: 'rgba(255,0,0,.5)' },
            { from: 40, to: 70, color: 'rgba(242,242,242,.5)' },
            { from: 70, to: 100, color: 'rgba(0,102,255,.5)' }],
        units: "%",
        animationRule: 'elastic',
        animationDuration: 500,
        colorNumbers: 'blue',
        colorValueBoxBackground: 'white',
        valueInt: 1,
        valueDec: 1
    }).draw();
};