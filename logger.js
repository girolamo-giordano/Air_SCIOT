var amqp = require('amqplib');
const { Console } = require('console');

amqp.connect('amqp://guest:guest@192.168.178.78:5672').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('iot/logs', {durable: false});

    ok = ok.then(function(_qok) {
      return ch.consume('iot/logs', function(msg) {
        console.log("'%s' [x] Received '%s'", new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')   ,msg.content.toString());
      }, {noAck: true});
    });

    var sok=ch.assertQueue('iot/sensors/airpur', {durable: false});
    sok= sok.then(function(_qok){
      return ch.consume('iot/sensors/airpur', function(msg) {
        var air = parseInt(msg.content.toString());
        if(air == 1)
          console.log("'%s' [x] Il purificatore è stato acceso",new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        else
          console.log("'%s' [x] Il purificatore è stato spento",new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') );
        
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });


  });
}).catch(console.warn);