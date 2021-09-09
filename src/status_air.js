var amqp = require('amqplib');
const { Console } = require('console');
require("dotenv").config();



amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var chaq=ch.assertQueue('iot/sensors/airpur', {durable: false});
    chaq= chaq.then(function(_qok){
      return ch.consume('iot/sensors/airpur', function(msg) {
        var air = parseInt(msg.content.toString());
        var nDate = new Date().toLocaleString('en-US', {
          timeZone: 'Europe/Amsterdam'
        });
        if(air == 1)
          console.log("'%s' [x] The air purifier has been turned on",nDate);
        else
          console.log("'%s' [x] The air purifier has been turned off",nDate);
        
      }, {noAck: true});
    });

    return chaq.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });


  });
}).catch(console.warn);