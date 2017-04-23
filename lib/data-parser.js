var devices = require('./devices');
var RF_DEVICE_ID = '0_0_11';

function parseSerialData(data, eventEmitter) {

  // data examples:
  // - RF sensor {"DEVICE":[{"G":"0","V":0,"D":11,"DA":"010101011111011101011100"}]}
  // - RF temp {"DEVICE":[{"G":"0201","V":0,"D":31,"DA":15.80000}]}
  // - RF humidity {"DEVICE":[{"G":"0201","V":0,"D":30,"DA":64}]}
  // - Eyes {"DEVICE":[{"G":"0","V":0,"D":999,"DA":"00FF00"}]}
  // - ?? {"DEVICE":[{"G":"0","V":0,"D":1007,"DA":"000000"}]}
  
  try {
    var message = JSON.parse(data);
    if (!message || !message['DEVICE']) return;

    var deviceDataArray = message['DEVICE'];
    if (!Array.isArray(deviceDataArray)) return;

    deviceDataArray.forEach(function(deviceData) {
      parseDeviceData(deviceData, eventEmitter);
    });

  } catch (err) {
    console.error(err);
    // log err
    return;
  }
}

function parseDeviceData(data, eventEmitter) {
  var deviceId = [data.G,data.V,data.D].join('_');
  var deviceType = getDeviceType(data, deviceId);
  var eventName = deviceId+'.'+deviceType;
  var deviceMeta = getDeviceMeta(data, deviceId, deviceType) || {};
  var eventData = {
    event: eventName,
    device: deviceId,
    deviceName: deviceMeta.name,
    topic: deviceMeta.topic,
    type: deviceType,
    data: data.DA
  };
  eventEmitter.emit(eventName, eventData);
}

function getDeviceType(data, deviceId) {
  if (deviceId === RF_DEVICE_ID) {
    return 'rfsensor';
  }
  if (data.G === '0' && data.V === 0) {
    if (data.D === 1007) return 'eyes';
    if (data.D === 999) return 'statuslight';
    return 'unknown';
  }
  // data.G could be anything for temp/humidity
  if (data.V === 0 && data.D === 30) return 'humidity';
  if (data.V === 0 && data.D === 31) return 'temperature';

  return 'unknown';
}

function getDeviceMeta(data, deviceId, deviceType) {
  if (deviceId === RF_DEVICE_ID) {
    return devices.getByCode(data.DA);
  }
  return devices.getById(deviceId + '.' + deviceType);
}

exports.parse = parseSerialData;
exports.parseDeviceData = parseDeviceData;