const {Telegraf} = require('telegraf');
var amqp = require('amqplib');
require("dotenv").config({ path: ".env" });


const bot = new Telegraf(`${process.env.BOT_TOKEN}`);



var id_user;
var activated=false;

bot.start((ctx) => 
    {
        id_user=ctx.chat.id;
        ctx.reply("Welcome, if you want to receive updates regarding the air quality do not close the bot");
    }
)

bot.command('status', (ctx) => {
    if(activated)
        ctx.reply("The air purifier is active");
    else
        ctx.reply("The air purifier is turned off");
  })

bot.action('on', (ctx)=>{

    if(activated)
        ctx.reply("The air purifier is already active");
    else
    {
        ctx.deleteMessage();
        ctx.reply("The air purifier has been turned on");
        onPurifier("1");
        activated=true;
    }
})

  bot.command('on', (ctx) => {
    if(activated)
        ctx.reply("The air purifier is already active");
    else
    {

        ctx.reply("The air purifier has been turned on");
        onPurifier("1");
        activated=true;
    }
        
  })

  bot.command('off', (ctx) => {
    if(activated)
    {
        ctx.reply("The air purifier has been turned off");
        onPurifier("0");
        activated=false;
    }
    else
        ctx.reply("The air purifier is already off");
        
  })


amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
process.once('SIGINT', function() { conn.close(); });
return conn.createChannel().then(function(ch) {

    var chaq = ch.assertQueue('iot/sensors/alarm', {durable: false});

    chaq = chaq.then(function(_qok) {
    return ch.consume('iot/sensors/alarm', function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
        const options = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Turn on the air purifier",
                    callback_data: 'on',
                  },
                ],
              ],
            },
          }
        if(!activated)
          bot.telegram.sendMessage(id_user, "Air quality: "+ msg.content.toString(), options);
        else
          bot.telegram.sendMessage(id_user, "Air quality: "+ msg.content.toString() + ", but the air purifier is already on");
    }, {noAck: true});
    });
});
}).catch(console.warn);


function onPurifier(msg){
    var q = 'iot/sensors/airpur';
    var qlog = 'iot/logs'
    amqp.connect(`amqp://guest:guest@${process.env.IP}`).then(function(conn) {
    return conn.createChannel().then(function(ch) {
        var chaq = ch.assertQueue(q, {durable: false});
        return chaq.then(function(_qok) {
          ch.sendToQueue(q, Buffer.from(msg),{persistent:true});
          if(activated == false)
            ch.sendToQueue(qlog,Buffer.from("off"));
          else
            ch.sendToQueue(qlog,Buffer.from("on"))
          return ch.close();
        });   
    });
    }).catch(console.warn);

    
}

bot.launch()