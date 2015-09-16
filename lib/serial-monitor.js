var dataParser = require('./data-parser');

function monitorSerialConn(serialConn, eventEmitter) {
  serialConn.on('data', function(data) {
    dataParser.parse(data, eventEmitter);
  });

  serialConn.on('end', function() {
    stop();
  });

  function stop() {
    serialConn = null;
    eventEmitter = null;
  }

  return {
    stop: stop
  };
}

exports.monitor = monitorSerialConn;
