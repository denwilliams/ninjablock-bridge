var devices = {};
var filename = require('path').join(__dirname, '../devices.json');
console.write('filename',filename);
// TODO: fix this super lazy config
if (require('fs').existsSync(filename)) {
  devices = require(filename);
}
module.exports = exports = devices;