#!/usr/bin/env node
var bridge = require('../lib').startServer();
bridge.onAny(function(evt) {
  var message = evt.event;
  if (evt.deviceName) message += (' (' + evt.deviceName + ')');
  message += ' > ' + evt.data;
  console.log(message);
});
