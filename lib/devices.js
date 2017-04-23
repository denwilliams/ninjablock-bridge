var devices = [];
var filename = require('path').join(__dirname, '../config.json');
// TODO: fix this super lazy config
if (require('fs').existsSync(filename)) {
  devices = require(filename).devices;
}

var deviceById = {};
var deviceByCode = {};

devices.forEach(function (device) {
  deviceById[device.id] = device;
  deviceByCode[device.code] = device;
});

exports.getById = function (id) {
  return deviceById[id];
};

exports.getByCode = function (code) {
  return deviceByCode[code];
};
