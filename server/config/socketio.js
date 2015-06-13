/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var coordinates = [[37.77906506406423,-122.39044204830788],[37.77865730788379,-122.39084980448831],[37.77840857961627,-122.39088764942743],[37.77940674542573,-122.38988948361796],[37.77962752576527,-122.38945781994998],[37.778227128642996,-122.39085821707226],[37.77810806007791,-122.39076640230891],[37.779626921716,-122.38924754067082],[37.77955908537112,-122.38910449368727],[37.77802518274618,-122.39063839631221],[37.777942305414456,-122.39051039031553],[37.77949124902625,-122.38896144670373],[37.77940113547025,-122.3888406769313],[37.77785942808272,-122.39038238431883],[37.777776550750986,-122.39025437832213],[37.77930394215937,-122.38872698691374],[37.77920674884851,-122.38861329689617],[37.77769367341925,-122.39012637232543],[37.777610796087515,-122.38999836632873],[37.77910955553763,-122.38849960687861],[37.779011904877365,-122.38838637421047],[37.77752791875578,-122.38987036033205],[37.77760438728325,-122.38958300847615],[37.778911317462104,-122.3882760782973],[37.77881073004686,-122.3881657823841],[37.777732779276604,-122.38924373315436],[37.777861171269976,-122.38890445783255],[37.77866913455941,-122.38809649454312],[37.778500837401495,-122.38805390837263],[37.77798956326333,-122.38856518251079],[37.778117955256704,-122.38822590718898],[37.77830003038268,-122.388043832063]];
// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/path/path.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
      console.log('logging [%s] DISCONNECTED', socket.address);
    });

     // Call startDrone
    socket.on('startDrone', function (data) {
      socket.emit('startDrone');
    });

    socket.on('pauseDrone', function (location) {
      // console.log('pauseDrone happened', location);
      socket.emit('pauseDrone', location);
    });
    socket.on('stopDrone', function (location) {
      socket.emit('stopDrone', location);
    });


    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });

};