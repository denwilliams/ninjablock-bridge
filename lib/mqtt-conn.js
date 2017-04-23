var mqtt = require('mqtt');
var config = require('../config.json');

exports.create = function () {
  var mqttConnected = false;
  
  var service = {
    emit: function (event, data) {
      if (!data.topic) return;

      var topic = data.topic;
      service.publish(topic, data);
    }
  };
  service.publish = function () {};

  if (config.mqtt && config.mqtt.host) {
    init(config.mqtt.host);
  }

  function init(host) {
    var mqttUri = 'mqtt://' + host;
    console.log('Connecting to MQTT broker ' + mqttUri);
    var mqttClient  = mqtt.connect(mqttUri);
    mqttConnected = false;

    mqttClient.on('connect', function () {
      logger.info('MQTT connected');
      mqttConnected = true;

      service.publish = function (topic, data) {
        if (!mqttConnected) return;
        mqttClient.publish(topic, JSON.stringify({ data }));
        console.info('Publish: ' + topic);
      }
    });

    mqttClient.on('close', console.log);
    mqttClient.on('offline', console.log);
    mqttClient.on('error', console.error);

    return service;
  }
};

