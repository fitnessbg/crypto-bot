var Telegraf = require("telegraf").Telegraf;
var cron = require("node-cron");
var tracker = require("./priceTracker");

var bot = new Telegraf(process.env.TELEGRAM_TOKEN);

var CHAT_ID = "TON_CHAT_ID_ICI";

bot.start(function(ctx) {
  ctx.reply("✅ Bot Trading actif!\n\n/xaut — Prix XAUT\n/wti — Prix WTI\n/brent — Prix Brent\n/signal — Signal XAUT 15m");
});

bot.command("xaut", function(ctx) {
  tracker.getXAUTPrice().then(function(msg) { ctx.reply(msg); });
});

bot.command("wti", function(ctx) {
  tracker.getOilPrice("WTI").then(function(msg) { ctx.reply(msg); });
});

bot.command("brent", function(ctx) {
  tracker.getOilPrice("BRENT").then(function(msg) { ctx.reply(msg); });
});

bot.command("signal", function(ctx) {
  tracker.getSignalXAUT().then(function(msg) { ctx.reply(msg); });
});

cron.schedule("*/15 * * * *", function() {
  tracker.getSignalXAUT().then(function(msg) {
    bot.telegram.sendMessage(CHAT_ID, msg);
  });
});

bot.launch().then(function() { console.log("Bot lance!"); });
process.once("SIGINT", function() { bot.stop(); });
process.once("SIGTERM", function() { bot.stop(); });
