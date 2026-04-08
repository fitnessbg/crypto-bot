
var Telegraf = require("telegraf").Telegraf;
var cron = require("node-cron");
var tracker = require("./priceTracker");
var cfg = require("./config");

var bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start(function(ctx) {
  ctx.replyWithMarkdown(cfg.MESSAGES.welcome);
});

bot.command("xaut", function(ctx) {
  tracker.getXAUTPrice().then(function(msg) {
    ctx.replyWithMarkdown(msg);
  });
});

bot.command("wti", function(ctx) {
  tracker.getOilPrice("WTI").then(function(msg) {
    ctx.replyWithMarkdown(msg);
  });
});

bot.command("brent", function(ctx) {
  tracker.getOilPrice("BRENT").then(function(msg) {
    ctx.replyWithMarkdown(msg);
  });
});

bot.command("signal", function(ctx) {
  tracker.getSignalXAUT().then(function(msg) {
    ctx.replyWithMarkdown(msg);
  });
});

// Alerte automatique toutes les 15 minutes
var CHAT_ID = ""; // ← mets ton Chat ID Telegram ici

cron.schedule("*/15 * * * *", function() {
  if (!CHAT_ID) return;
  tracker.getSignalXAUT().then(function(msg) {
    bot.telegram.sendMessage(CHAT_ID, msg, { parse_mode: "Markdown" });
  });
});

bot.launch().then(function() {
  console.log("✅ Bot Trading lancé !");
});

process.once("SIGINT", function() { bot.stop(); });
process.once("SIGTERM", function() { bot.stop(); });
