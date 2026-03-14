
const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const { getTokenPrice } = require("./priceTracker");
const { MESSAGES, RESPONSES, BOT_CONFIG } = require("./config");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const pick = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

bot.start(function(ctx) {
  var name = ctx.from.first_name || "ami";
  var msg = MESSAGES.welcome.replace("{name}", name);
  ctx.reply(msg);
});

bot.command("price", async function(ctx) {
  ctx.reply("Recherche du prix...");
  var msg = await getTokenPrice();
  ctx.reply(msg);
});

bot.command("roadmap", function(ctx) {
  ctx.reply(MESSAGES.roadmap);
});

bot.command("faq", function(ctx) {
  ctx.reply(MESSAGES.faq);
});

bot.command("stats", function(ctx) {
  ctx.reply(MESSAGES.stats);
});

bot.on("text", function(ctx) {
  var text = ctx.message.text.toLowerCase();
  var keys = Object.keys(RESPONSES.keywordMap);
  for (var i = 0; i < keys.length; i++) {
    var kws = keys[i].split("|");
    var found = false;
    for (var j = 0; j < kws.length; j++) {
      if (text.includes(kws[j])) {
        found = true;
        break;
      }
    }
    if (found) {
      var key = RESPONSES.keywordMap[keys[i]];
      ctx.reply(pick(RESPONSES[key]));
      return;
    }
  }
  if (ctx.chat.type === "private") {
    ctx.reply(pick(RESPONSES.generic));
  }
});

cron.schedule("0 0,6,12,18 * * *", async function() {
  var msg = pick(MESSAGES.scheduledPromos);
  for (var i = 0; i < BOT_CONFIG.PROMO_CHANNELS.length; i++) {
    try {
      await bot.telegram.sendMessage(BOT_CONFIG.PROMO_CHANNELS[i], msg);
    } catch(e) {
      console.error("Erreur:", e.message);
    }
  }
});

bot.launch().then(function() {
  console.log("Bot OILFIRE lance !");
});

process.once("SIGINT", function() { bot.stop("SIGINT"); });
process.once("SIGTERM", function() { bot.stop("SIGTERM"); });
