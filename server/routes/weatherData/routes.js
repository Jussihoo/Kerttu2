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
    var shrinkRounds = 0;
    if (req.query.hours !== undefined) {
        var hours = Number(req.query.hours);
        
        if (hours <= 12) {
            shrinkRounds = 0;    
        }
        else if (hours > 12 && hours <= 24 ) {
            shrinkRounds = 1;
        }
        else if (hours > 24 && hours <= 48 ) {
            shrinkRounds = 2;    
        }
        else if (hours > 48) {
            shrinkRounds = 3;
        }
    }
    
    
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var device = Number(req.query.device);
    var devLoc = Number(req.query.devLoc);
    var measurements = {};
    var dataCounter = 0;
	//console.log("SO you want weatherData?" + type + " " + hours);
    //console.log("startDate " + startDate + " endDate " + endDate);
    switch (type){
        case 'temperature':
            getWeatherData(Temperature, device, devLoc, hours, startDate, endDate);
            break;
        case 'humidity':
            getWeatherData(Humidity, device, devLoc, hours, startDate, endDate);
            break;
        case 'pressure':
            getWeatherData(Pressure, device, devLoc, hours, startDate, endDate);
            break;
        case 'battery':
            getWeatherData(Battery, device, devLoc, hours, startDate, endDate);
            break;
        case 'all':
            getWeatherData(Temperature, device, devLoc, hours, startDate, endDate);
            break;
    }
    
    function getWeatherData(model, device, devLoc, hours, startDate, endDate){
        //console.log("haetaan");
        var findParams = {device: device};
        if(devLoc !== undefined){ // device given, fetch it
            findParams['devLoc'] = devLoc;    
        }
        if (hours !== undefined) {
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
                    sort({timestamp:1}).
                    exec(handleResponse);
            }
        }
        else if(startDate !== undefined && endDate !== undefined) {
            var oneDay=1000*60*60*24; // day in milliseconds
            var timeDiffInDays = Math.round((endDate - startDate)/oneDay);
            
            if (timeDiffInDays <= 1 ) {
                shrinkRounds = 1;    
            }
            else if (timeDiffInDays > 1 && timeDiffInDays <= 2 ) {
                shrinkRounds = 2;    
            }
            else if (timeDiffInDays > 2 && timeDiffInDays <= 7 ) {
                shrinkRounds = 3;    
            }
            else if (timeDiffInDays > 7 && timeDiffInDays <= 30 ) {
                shrinkRounds = 4;    
            }
            else if (timeDiffInDays > 30) {
                shrinkRounds = 5;    
            }
            
            model.
                find(findParams).
                where({timestamp: {$gte: new Date(Number(startDate)), $lte: new Date(Number(endDate))}}).
                select({'_id': 0}).
                sort({timestamp:1}).
                exec(handleResponse);    
        }
    };
    
    function handleResponse(err, data){
        if(err){
            console.log("error in reading data from database: " + err);
            res.status(400).send({error: err});
            return;
        }
        // shrink data received from database
        // on each for loop drop every other measurement
        var index;
        for (var i=0;i<shrinkRounds;i++){
            index = data.length;
            while (index--) {
              (index + 1) % 2 === 0 && data.splice(index-1, 1);
            }
            index = data.length;
        }
        
        if(type=='all' && dataCounter==0) { // temperature data returned
            if (data){
                measurements['temperature'] = data;
            }
            getWeatherData(Humidity, device, devLoc, hours, startDate, endDate);    
        }
        else if(type=='all' && dataCounter==1) { // Humidity data returned
            if (data){
                measurements['humidity'] = data;
            }
            getWeatherData(Pressure, device, devLoc, hours, startDate, endDate);    
        }
        else if(type=='all' && dataCounter==2) { // Pressure data returned
            if (data){
                measurements['pressure'] = data;
            }
            getWeatherData(Battery, device, devLoc, hours, startDate, endDate);    
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

        if((type=='all' && dataCounter==3 && Object.keys(measurements).length === 0) ||
            type!='all' && Object.keys(measurements).length === 0 ){
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
    
    var weatherDataArray = req.body;
    
    for (var i=0;i<weatherDataArray.length;i++) {
        time = new Date(weatherDataArray[i].timestamp*1000) // convert POSIX to JS Date
        if (weatherDataArray[i].deviceID == ruuvitag.RUUVITAG) {
          var location = '';
          var pushData = {};  // init

          if (weatherDataArray[i].locID == ruuvitag.RUUVITAG_LOC_OUTSIDE ) {
            location = 'outside';
            pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_OUTSIDE;
          }
          else if (weatherDataArray[i].locID == ruuvitag.RUUVITAG_LOC_INSIDE_1 ) {
            location = 'inside';
            pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_INSIDE_1;  
          }
          else if (weatherDataArray[i].locID == ruuvitag.RUUVITAG_LOC_INSIDE_2 ) {
            location = 'inside';
            pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_INSIDE_2;  
          }
          else {
            location = 'unknown';
            pushData['devLoc'] = ruuvitag.RUUVITAG_LOC_UNKNOWN;
          }
          pushData['device'] = ruuvitag.RUUVITAG;
          pushData['time'] = time;

          if (weatherDataArray[i].temperature !== undefined ) {
            //console.log (location+" temperature is " + weatherDataArray[i].temperature + " ºCelsius");
            storeWeatherData('temperature', ruuvitag.RUUVITAG, weatherDataArray[i].locID, weatherDataArray[i].temperature, time);
            pushData['temperature'] = weatherDataArray[i].temperature;
          }
          if (weatherDataArray[i].humidity !== undefined) {
            //console.log (location+" humidity is " + weatherDataArray[i].humidity + " %");
            storeWeatherData('humidity', ruuvitag.RUUVITAG, weatherDataArray[i].locID, weatherDataArray[i].humidity, time);
            pushData['humidity'] = weatherDataArray[i].humidity;
          }
          if (weatherDataArray[i].pressure !== undefined) {
            //console.log (location+" pressure is " + weatherDataArray[i].pressure + " hPa");
            storeWeatherData('pressure', ruuvitag.RUUVITAG, weatherDataArray[i].locID, weatherDataArray[i].pressure, time);
            pushData['pressure'] = weatherDataArray[i].pressure;
          }
          if (weatherDataArray[i].battery !== undefined) {
            //console.log (location+" battery voltage is " + weatherDataArray[i].battery/1000 + " V");
            storeWeatherData('battery', ruuvitag.RUUVITAG, weatherDataArray[i].locID, weatherDataArray[i].battery, time);
            pushData['battery'] = weatherDataArray[i].battery;
          }
          
          if (i == weatherDataArray.length-1 ) { // send last measurement via socket
              // ************************************
              //var socCom = new socketComms.handleIOComms(server.server);
              var socCom = server.socCom;
              socCom.sendData('pushWeatherData', pushData) // send data to client socket
              // ************************************
          }
        }
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
