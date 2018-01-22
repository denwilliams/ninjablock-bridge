const mqtt = require('mqtt');
const config = require('../config.json');

exports.create = (codeEmitter) => {
  var mqttConnected = false;

  var service = {
    emit: function (event, data) {
      if (!data.topic) return;

      var topic = data.topic;
      service.publish(topic, data);
    }
  };
  service.publish = () => {};

  if (config.mqtt && config.mqtt.host) {
    init(config.mqtt.host);
  }

  return service;

  function init(host) {
    var mqttUri = 'mqtt://' + host;
    console.info('Connecting to MQTT broker ' + mqttUri);
    var mqttClient  = mqtt.connect(mqttUri);
    mqttConnected = false;

    mqttClient.on('connect', function () {
      console.info('MQTT connected');
      mqttConnected = true;

      console.log('subscribing to topic', config.mqtt.topic);
      mqttClient.subscribe(config.mqtt.topic);

      service.publish = function (topic, data) {
        if (!mqttConnected) return;
        mqttClient.publish(topic, JSON.stringify({ data: data }));
        console.info('Publish: ' + topic);
      }
    });

    mqttClient.on('message', (topic, message) => {
      console.log('got message');
      const strMsg = message.toString();
      const data = strMsg ? JSON.parse(strMsg) : undefined;
      codeEmitter(data.code);
    });

    mqttClient.on('close', console.info.bind(console, 'mqtt_close'));
    mqttClient.on('offline', console.info.bind(console, 'mqtt_offline'));
    mqttClient.on('error', console.error.bind(console, 'mqtt_error'));
  }
};

