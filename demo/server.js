var EventEmitter2 = require('eventemitter2').EventEmitter2;
var mockSerial = new EventEmitter2();
mockSerial.name = 'mockSerial';
var bridge = require('../lib').startServer({serialConn:mockSerial});

setInterval(function() {
  mockSerial.emit('data', '{"DEVICE":[{"G":"0","V":0,"D":11,"DA":"010101011111011101011100"}]}');
}, 5000);

bridge.onAny(function(evt) {
  console.log(evt);
});
