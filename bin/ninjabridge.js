var bridge = require('../lib').startServer();
bridge.onAny(function(evt) {
  console.log(evt);
});
