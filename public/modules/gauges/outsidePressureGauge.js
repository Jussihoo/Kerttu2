var outsidePressureGauge= null;
function initOutsidePressureGauge() {
    outsidePressureGauge = new RadialGauge({
        renderTo: 'outsidePressureGauge',
        title: 'Pressure',
        width: 190,
        height: 190,
        minValue: 940,
        maxValue: 1060,
        majorTicks: ['940','960','980','1000','1020','1040','1060'],
        highlights: [
            { from: 940, to: 970, color: 'rgba(0,0,204,.5)' },
            { from: 970, to: 990, color: 'rgba(0,102,255,.5)' },
            { from: 990, to: 1010, color: 'rgba(255,100,0,.5)' },
            { from: 1010, to: 1030, color: 'rgba(255,200,0,.5)' },
            { from: 1030, to: 1060, color: 'rgba(255,0,0,.5)' }
        ],
        units: "hPa",
        animationRule: 'elastic',
        animationDuration: 500,
        colorNumbers: 'blue',
        colorValueBoxBackground: 'white',
        valueInt: 1,
        valueDec: 1
    }).draw();
};