var insideTempGauge= null;
function initInsideTempGauge() {
    insideTempGauge = new RadialGauge({
        renderTo: 'insideTempGauge',
        title: 'Temperature',
        width: 190,
        height: 190,
        minValue: 5,
        maxValue: 35,
        minorTicks: 5,
        majorTicks: ['5','10','15','20','25', '30', '35'],
        highlights: [
            { from: 5, to: 18, color: 'rgba(0,102,255,.5)' },
            { from: 18, to: 23, color: 'rgba(242,242,242,.5)' },
            { from: 23, to: 35, color: 'rgba(255,0,0,.5)' }],
        units: "°C",
        animationRule: 'elastic',
        animationDuration: 500,
        colorNumbers: 'blue',
        colorValueBoxBackground: 'white',
        valueInt: 1,
        valueDec: 1
    }).draw();
};