const {Telegraf} = require('telegraf');

const bot = new Telegraf('1769775754:AAHZ3u_eR7-Bw0aruHLXpUYLGRqtFvmeKX8');


var id;
bot.command('start', (ctx) => {
    console.log(ctx.chat.id);
    id=ctx.chat.id;
    ctx.reply("Benvenuto "+ctx.from.username);
})

console.log(id);

var amqp = require('amqplib');
    amqp.connect('amqp://guest:guest@192.168.178.78:5672').then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {

        var ok = ch.assertQueue('iot/logs', {durable: false});

        ok = ok.then(function(_qok) {
        return ch.consume('iot/logs', function(msg) {
            console.log(" [x] Received '%s'", msg.content.toString());
            bot.telegram.sendMessage(id, 'hello there!.'+ msg.content.toString(), {})
        }, {noAck: true});
        });

        return ok.then(function(_consumeOk) {
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
        });
    });
    }).catch(console.warn);



bot.launch()