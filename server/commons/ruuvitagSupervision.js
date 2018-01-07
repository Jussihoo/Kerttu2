// Ruuvitag configuration
var ruuvitag = require('../config/ruuvitag');
// facebook feed configuration
var facebook = require('../config/facebook');
// Facebook communication
var sendToFacebook = require('../commons/sendToFacebook');

//var timerId = null;

// ruuvitags have found to be offline. Might be also caused by Raspberry being offline
function ruuvitagsOffline(){
  console.log("Failed to get weather data from Ruuvitags");
  //sendToFacebook.post(facebook.RUUVITAG_LOST, facebook.TOKEN)
}

function startSupervision(){
    if (!this.timerId) {
        console.log("timer started");
        this.timerId = setTimeout(ruuvitagsOffline, ruuvitag.RUUVITAG_SUPERVISION_TIME);
    }
    else {
        console.log("clear the timer and restart");
        clearTimeout(this.timerId); // stop the timer, Ruuvitags are online
        // re-start timer
        this.timerId = setTimeout(ruuvitagsOffline, ruuvitag.RUUVITAG_SUPERVISION_TIME);
    }
}


module.exports.startSupervision = startSupervision; 