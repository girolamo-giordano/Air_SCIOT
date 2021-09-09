var amqp = require('amqplib');
const { Console } = require('console');
require("dotenv").config();



amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var chaq = ch.assertQueue('iot/logs', {durable: false});

    chaq = chaq.then(function(_qok) {
      return ch.consume('iot/logs', function(msg) {
        var nDate = new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Amsterdam'
        });
        console.log("'%s' [x] Received '%s'",nDate   ,msg.content.toString());
      }, {noAck: true});
    });

    return chaq.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });


  });
}).catch(console.warn);