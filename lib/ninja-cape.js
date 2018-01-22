var EventEmitter2 = require('eventemitter2').EventEmitter2;
var serial = require('serialport');
var SerialPort = serial.SerialPort;
var serialMonitor = require('./serial-monitor');


/**
 * Connects to the
 * @param  {Object} opts - Optional options.
 *                  port {String}
 *                    The port to connect to.
 *                    If none is provided then the default will be used.
 *                  eventEmitter {EventEmitter}
 *                    Optionally provide an event emitter to use.
 *                    If none is provided then a new one will be created.
 * @return {NinjaConnection} A connection to the Ninja Block
 */
function connectNinjaCape(opts) {
  var events = opts.eventEmitter || new EventEmitter2();
  var port = opts.port || '/dev/ttyO1';

  var serialConn = opts.serialConn || new SerialPort(port, {
    parser: serial.parsers.readline('\n')
  });

  var monitor = serialMonitor.monitor(serialConn, events);

  function stop() {
    monitor.stop();
  }

  function send(code) {
    serialConn.write(code, 'utf8');
  }

  return {
    on: events.on.bind(events),
    send,
    monitor,
    stop
  };
}

exports.connect = connectNinjaCape;
