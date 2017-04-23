var EventEmitter2 = require('eventemitter2').EventEmitter2;
var ninjaCape = require('./ninja-cape');
var server = require('./server');
var mqttConn = require('./mqtt-conn');

var config = require('../config.json');

/**
 * Connects to the ninjablock cape, and start accessible event servers
 * @param  {Object} opts - server configuration options
 * @return {Object} - bridge server params
 */
function connectAndServe(opts) {
  opts = opts || {};

  var socketServer;
  var mqtt;
  var eventEmitter = new EventEmitter2();
  eventEmitter.name = 'rootEmitter';
  
  var capeConnection = ninjaCape.connect({
    eventEmitter: eventEmitter,
    serialConn: opts.serialConn
  });

  if (!config.server || !config.server.disabled) {
    socketServer = server.create(capeConnection);
    socketServer.start();
    republishEvents(eventEmitter, socketServer);
  }

  if (!config.mqtt || !config.mqtt.disabled) {
    mqtt = mqttConn.create();
    republishEvents(eventEmitter, mqtt);
  }

  function stop() {
    if (socketServer) socketServer.stop();
    capeConnection.stop();
  }

  return {
    on: eventEmitter.on.bind(eventEmitter),
    onAny: eventEmitter.onAny.bind(eventEmitter),
    cape: capeConnection,
    server: socketServer,
    stop: stop
  };
}

function republishEvents(source, target) {
  source.onAny(function (data) {
    target.emit(data.event, data);
  });
}

exports.connect = ninjaCape.connect;
exports.startServer = connectAndServe;
