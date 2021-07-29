var mqtt = require("mqtt");
var url = require("url");

var mqtt_url = url.parse("mqtt://guest:guest@192.168.178.78:1883");
var auth = (mqtt_url.auth || ":").split(":");
var url = "mqtt://" + mqtt_url.host;
var options = {
  port: mqtt_url.port,
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  username: auth[0],
  password: auth[1],
};

  var client = mqtt.connect(url, options);

  client.on("connect", function () {
    var humidity = Math.floor(Math.random() * 20).toString();

    client.publish("iot/sensors/humidity", humidity, function () {
      client.end();
      console.log("Sent " + humidity);
    });
  });
