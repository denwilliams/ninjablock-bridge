var EventEmitter2 = require('eventemitter2').EventEmitter2;
var ninjaCape = require('./ninja-cape');
var server = require('./server');

function connectAndServe(opts) {
  var eventEmitter = new EventEmitter2();
  eventEmitter.name = 'rootEmitter';
  
  var capeConnection = ninjaCape.connect({
    eventEmitter: eventEmitter,
    serialConn: opts.serialConn
  });

  var socketServer = server.create(capeConnection);
  socketServer.start();

  function stop() {
    socketServer.stop();
    capeConnection.stop();
  }

  republishEvents(eventEmitter, socketServer);

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
