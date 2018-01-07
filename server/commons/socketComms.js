var socketio    = require ('socket.io')({ origins: '*:*'});

function handleIOComms(server){
    //create socket
    if (server){
        this.server = server;
        this.io = socketio.listen(server);
    }
    
    // function for making the IO socket connection
    this.makeConnection = function(){
        if (this.io){
            this.io.on('connection', function (socket) {
                console.log("client connected");
            });
        }
    }
    // function for sending data over the socket
    this.sendData = function(eventName, data){
        if (this.io){
            this.io.emit(eventName, JSON.stringify(data));  // send data to browse    
        }
    }
}

module.exports.handleIOComms = handleIOComms;