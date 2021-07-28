const {Telegraf} = require('telegraf');

const bot = new Telegraf('1769775754:AAHZ3u_eR7-Bw0aruHLXpUYLGRqtFvmeKX8');

bot.command('start', (ctx) => {
    console.log(ctx.from.first_name);
    ctx.reply("Benvenuto a"+ctx.from.username);
})

bot.launch()