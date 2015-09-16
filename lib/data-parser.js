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
  var deviceName = getDeviceName(data, deviceId);
  var eventName = deviceId;
  var eventData = {
    event: eventName,
    device: deviceId,
    name: deviceName,
    data: data.DA
  };
  eventEmitter.emit(eventName, eventData);
}

function getDeviceName(data, deviceId) {
  if (deviceId === '0_0_11') {
    return 'rfsensor';
  }
  if (data.G === '0' && data.V === 0) {
    if (data.D === 1007) return '???';
    if (data.D === 999) return 'eyes';
    return 'unknown';
  }
  if (data.G === '0201' && data.V === 0) {
    if (data.D === 30) return 'humidity';
    if (data.D === 31) return 'temperature';
    return 'unknown';
  }
  return 'unknown';
}

exports.parse = parseSerialData;
exports.parseDeviceData = parseDeviceData;