var https = require("https");
// facebook feed configuration
var facebook = require('../config/facebook');

module.exports.post = function(str, token) {
  var req = https.request({
    host: 'graph.facebook.com',
    path: '/'+facebook.FEED_ID+'/feed?',
    method: 'POST'
  }, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log('got chunk '+chunk);
    });
    res.on('end', function() {
      console.log('received ack from Facebook');
    });
  });
  req.end('message='+str
    +'&access_token='+encodeURIComponent(token));
  console.log('Sent to Facebook feed');
}