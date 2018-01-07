var router = require('express').Router();
var server = require('../../../bin/server');
var socketComms = require('../../commons/socketComms');

// Ruuvitag configuration
var ruuvitag = require('../../config/ruuvitag');
// Ruuvitag supervision
var ruuvitagSupervision = require('../../commons/ruuvitagSupervision');

// models
var Temperature = require('./temperatureModel');
var Humidity = require('./humidityModel');
var Pressure = require('./pressureModel');
var Battery = require('./batteryModel');

// fetch the weatherData from the database
router.get('/', function(req, res, next) {
    var type = req.query.type;
    var hours = Number(req.query.hours);
    var device = Number(req.query.device);
    var devLoc = Number(req.query.devLoc);
    var measurements = {};
    var dataCounter = 0;
	console.log("SO you want weatherData?" + type + " " + hours);
    switch (type){
        case 'temperature':
            getWeatherData(Temperature, device, devLoc, hours);
            break;
        case 'humidity':
            getWeatherData(Humidity,device, devLoc, hours);
            break;
        case 'pressure':
            getWeatherData(Pressure, device, devLoc, hours);
            break;
        case 'battery':
            getWeatherData(Battery, device, devLoc, hours);
            break;
        case 'all':
            getWeatherData(Temperature, device, devLoc, hours);
            break;
    }
    
    function getWeatherData(model, device, devLoc, hours){
        console.log("haetaan");
        var findParams = {device: device};
        if(devLoc != 0){ // device given, fetch it
            findParams['devLoc'] = devLoc;    
        }
        if ( hours == 0){ // get the last item from the database
            model.
                findOne(findParams).
                sort({timestamp:-1}).
                select({'_id': 0}).
                exec(handleResponse);    
        }
        else {
            model.
                find(findParams).
                where({timestamp: {$gte: new Date(new Date().setHours(new Date().getHours()-hours))}}).
                select({'_id': 0}).
                exec(handleResponse);
        }
    };
    
    function handleResponse(err, data){
        if(err){
            console.log("error in reading data from database: " + err);
            res.status(400).send({error: err});
            return;
        }
        if(type=='all' && dataCounter==0) { // temperature data returned
            if (data){
                measurements['temperature'] = data;
            }
            getWeatherData(Humidity, device, devLoc, hours);    
        }
        else if(type=='all' && dataCounter==1) { // Humidity data returned
            if (data){
                measurements['humidity'] = data;
            }
            getWeatherData(Pressure, device, devLoc, hours);    
        }
        else if(type=='all' && dataCounter==2) { // Pressure data returned
            if (data){
                measurements['pressure'] = data;
            }
            getWeatherData(Battery, device, devLoc, hours);    
        }
        else if(type=='all' && dataCounter==3){ // last weatherData returned, send response
            if (data){
                measurements['battery'] = data;
            }
            if (Object.keys(measurements).length !== 0){
                console.log(measurements);
                console.log("let's send");
                res.json(measurements);
            }
        }
        if (type!='all'){
            measurements[type] = data;
            res.json(measurements);    
        }

        if((type=='all' && dataCounter==3 && Object.keys(measurements).length === 0) || type!='all'){
            console.log("return error 404");
            res.status(404).send({error: 'no data'});
        }

        dataCounter++;
        return;
    };
});

// weatherData is sent to the server from e.g. ruuvitags through Raspberry
router.post('/', function(req, res, next) {

	var msg = "You sent me weatherData";
    //console.dir(req.body);
	//console.log("thanks for sending me weatherData");
    ruuvitagSupervision.startSupervision(); // re-start the supervision timer
    
    var data = req.body;
    
    time = new Date();
    if (data.deviceID == ruuvitag.RUUVITAG) {
      var location = '';
      var pushData = {};  // init
      
      if (data.locID == ruuvitag.RUUVITAG_LOC_OUTSIDE ) {
        location = 'outside';
        pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_OUTSIDE;
      }
      else if (data.locID == ruuvitag.RUUVITAG_LOC_INSIDE_1 ) {
        location = 'inside';
        pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_INSIDE_1;  
      }
      else if (data.locID == ruuvitag.RUUVITAG_LOC_INSIDE_2 ) {
        location = 'inside';
        pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_INSIDE_2;  
      }
      else {
        location = 'unknown';
        pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_UNKNOWN;
      }
      pushData['device'] = ruuvitag.RUUVITAG;
      pushData['time'] = time;
      
      if (data.temperature ) {
        //console.log (location+" temperature is " + data.temperature + " ºCelsius");
        storeWeatherData('temperature', ruuvitag.RUUVITAG, data.locID, data.temperature, time);
        pushData['temperature'] = data.temperature;
      }
      if (data.humidity) {
        //console.log (location+" humidity is " + data.humidity + " %");
        storeWeatherData('humidity', ruuvitag.RUUVITAG, data.locID, data.humidity, time);
        pushData['humidity'] = data.humidity;
      }
      if (data.pressure) {
        //console.log (location+" pressure is " + data.pressure + " hPa");
        storeWeatherData('pressure', ruuvitag.RUUVITAG, data.locID, data.pressure, time);
        pushData['pressure'] = data.pressure;
      }
      if (data.battery) {
        //console.log (location+" battery voltage is " + data.battery/1000 + " V");
        storeWeatherData('battery', ruuvitag.RUUVITAG, data.locID, data.battery, time);
        pushData['battery'] = data.battery;
      }
      //console.log("****");
      // ************************************
      //var socCom = new socketComms.handleIOComms(server.server);
      var socCom = server.socCom;
      socCom.sendData('pushWeatherData', pushData) // send data to client socket
      // ************************************
    }

	// Add JSON body to response
	res.json(msg);
    
    function storeWeatherData(collection, deviceID, locID, value, timestamp){
        var data = {'device': deviceID,
                    'devLoc': locID,
                    'timestamp': timestamp};
        //console.log("saving data");
        //console.dir(data);
        switch (collection){
            case 'temperature':
                data.temperature = value;
                var temperature = new Temperature(data);
                temperature.save()
                    .then(function(temperature){
                        //console.log("temperature saved");
                    })
                    .catch(function(err){
                        console.log('error in storing temperature to database '+err);
                    })
                break;
            case 'humidity':
                data.humidity = value;
                var humidity = new Humidity(data);
                humidity.save()
                    .then(function(humidity){
                        //console.log("humidity saved");
                    })
                    .catch(function(err){
                        console.log('error in storing humidity to database '+err);
                    })
                break;
            case 'pressure':
                data.pressure = value;
                var pressure = new Pressure(data);
                pressure.save()
                    .then(function(pressure){
                        //console.log("pressure saved");
                    })
                    .catch(function(err){
                        //console.log('error in storing pressure to database '+err);
                    })
                break;
            case 'battery':
                data.voltage = value;
                var battery = new Battery(data);
                battery.save()
                    .then(function(battery){
                        //console.log("battery saved");
                    })
                    .catch(function(err){
                        console.log('error in storing battery to database '+err);
                    });
                break;
        }
                             
    };
                                                                               
});

module.exports = router;