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
    console.info('Connecting to MQTT broker ' + mqttUri);
    var mqttClient  = mqtt.connect(mqttUri);
    mqttConnected = false;

    mqttClient.on('connect', function () {
      console.info('MQTT connected');
      mqttConnected = true;

      service.publish = function (topic, data) {
        if (!mqttConnected) return;
        mqttClient.publish(topic, JSON.stringify({ data: data }));
        console.info('Publish: ' + topic);
      }
    });

    mqttClient.on('close', console.info);
    mqttClient.on('offline', console.info);
    mqttClient.on('error', console.error);

    return service;
  }
};
