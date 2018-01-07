
var outsideTempGauge= null;
function initOutsideTempGauge() {
    outsideTempGauge = new RadialGauge({
        renderTo: 'outsideTempGauge',
        title: 'Temperature',
        width: 190,
        height: 190,
        minValue: -30,
        maxValue: 40,
        majorTicks: ['-30','-20','-10','0','10','20','30','40'],
        highlights: [
            { from: -30, to: 0, color: 'rgba(0,102,255,.5)' },
            { from: 0, to: 20, color: 'rgba(242,242,242,.5)' },
            { from: 20, to: 40, color: 'rgba(255,0,0,.5)' }],
        units: "°C",
        animationRule: 'elastic',
        animationDuration: 500,
        colorNumbers: 'blue',
        colorValueBoxBackground: 'white',
        valueInt: 1,
        valueDec: 1
    }).draw();
};