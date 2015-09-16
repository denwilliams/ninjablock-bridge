var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function() {
  console.log('connect');
});
socket.on('0_0_11', function(data){
  console.log('0_0_11', data);
});
socket.on('event', function(data) {
  console.log('event', data);
});
socket.on('disconnect', function() {
  console.log('disconnect');
});
