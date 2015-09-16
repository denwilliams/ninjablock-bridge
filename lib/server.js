var Server = require('socket.io');

function createSocketServer(opts) {
  var port = opts.port || 3000;
  var io = new Server();
  io.on('connection', connect);

  function connect(socket) {
    console.log('connect');
    //socket.emit('an event', { some: 'data' });
  }

  function start() {
    console.log('starting');
    io.listen(port);
  }

  function stop() {
    console.log('stopping');
  }

  function emit(event, data) {
    io.emit(event, data);
    io.emit('event', data);
  }

  return {
    start: start,
    stop: stop,
    emit: emit
  };
}

exports.create = createSocketServer;
