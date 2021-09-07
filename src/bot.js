const {Telegraf} = require('telegraf');
var amqp = require('amqplib');
require("dotenv").config({ path: ".env" });


const bot = new Telegraf(`${process.env.BOT_TOKEN}`);



var id_user;
var activated=false;

bot.start((ctx) => 
    {
        console.log(ctx.chat.id);
        id_user=ctx.chat.id;
        ctx.reply("Benvenuto "+ctx.from.username + " se vuoi ricevere aggiornamenti riguardanti la qualità dell'aria non chiudere il bot");
    }
)

bot.command('status', (ctx) => {
    if(activated)
        ctx.reply("Il purificatore è attivo");
    else
        ctx.reply("Il purificatore è spento");
  })

bot.action('on', (ctx)=>{

    if(activated)
        ctx.reply("Il purificatore è già attivo");
    else
    {
        ctx.deleteMessage();
        ctx.reply("Il purificatore è stato acceso");
        onPurifier("1");
        activated=true;
    }
})

  bot.command('on', (ctx) => {
    if(activated)
        ctx.reply("Il purificatore è già attivo");
    else
    {

        ctx.reply("Il purificatore è stato acceso");
        onPurifier("1");
        activated=true;
    }
        
  })

  bot.command('off', (ctx) => {
    if(activated)
    {
        ctx.reply("Il purificatore è stato spento");
        onPurifier("0");
        activated=false;
    }
    else
        ctx.reply("Il purificatore è già spento");
        
  })


amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
process.once('SIGINT', function() { conn.close(); });
return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('iot/sensors/alarm', {durable: false});

    ok = ok.then(function(_qok) {
    return ch.consume('iot/sensors/alarm', function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
        const options = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Accendere il purificatore d'aria",
                    callback_data: 'on',
                  },
                ],
              ],
            },
          }
        if(!activated)
          bot.telegram.sendMessage(id_user, "Qualità dell'aria: "+ msg.content.toString(), options);
        else
          bot.telegram.sendMessage(id_user, "Qualità dell'aria: "+ msg.content.toString() + ", ma il purificatore d'aria è già acceso");
    }, {noAck: true});
    });
});
}).catch(console.warn);


function onPurifier(msg){
    var q = 'iot/sensors/airpur';
    var qlog = 'iot/logs'
    amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
    return conn.createChannel().then(function(ch) {
        var ok = ch.assertQueue(q, {durable: false});
        return ok.then(function(_qok) {
          ch.sendToQueue(q, Buffer.from(msg),{persistent:true});
          if(activated == false)
            ch.sendToQueue(qlog,Buffer.from("off"));
          else
            ch.sendToQueue(qlog,Buffer.from("on"))
          //return ch.close();  
        });
    }).finally(function() {
        setTimeout(function() {
            conn.close();
          }, 500);
    });
    }).catch(console.warn);

    
}

bot.launch()