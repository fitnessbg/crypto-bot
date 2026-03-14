var Telegraf = require("telegraf").Telegraf;
var cron = require("node-cron");
var price = require("./priceTracker");
var cfg = require("./config");

var bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(function(ctx) {
  ctx.reply("Bienvenue sur OILFIRE ! Commandes: /price /roadmap /faq /stats");
});

bot.command("price", function(ctx) {
  price.getTokenPrice().then(function(msg) {
    ctx.reply(msg);
  });
});

bot.command("roadmap", function(ctx) {
  ctx.reply(cfg.MESSAGES.roadmap);
});

bot.command("faq", function(ctx) {
  ctx.reply(cfg.MESSAGES.faq);
});

bot.command("stats", function(ctx) {
  ctx.reply(cfg.MESSAGES.stats);
});

bot.launch().then(function() {
  console.log("Bot lance!");
});

process.once("SIGINT", function() { bot.stop(); });
process.once("SIGTERM", function() { bot.stop(); });
