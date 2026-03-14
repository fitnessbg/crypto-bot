
Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const { getTokenPrice } = require("./priceTracker");
const { MESSAGES, RESPONSES, BOT_CONFIG } = require("./config");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

bot.start((ctx) => {
  const name = ctx.from.first_name || "ami";
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("Projet", "about"), Markup.button.callback("Prix", "price")],
    [Markup.button.callback("Roadmap", "roadmap"), Markup.button.callback("FAQ", "faq")],
  ]);
  ctx.replyWithMarkdown(MESSAGES.welcome.replace("{name}", name), keyboard);
});

bot.command("price", async (ctx) => {
  ctx.reply("Recherche du prix...");
  const msg = await getTokenPrice();
  ctx.replyWithMarkdown(msg);
});

bot.command("roadmap", (ctx) => ctx.replyWithMarkdown(MESSAGES.roadmap));
bot.command("faq", (ctx) => ctx.replyWithMarkdown(MESSAGES.faq));
bot.command("stats", (ctx) => ctx.replyWithMarkdown(MESSAGES.stats));

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  await ctx.answerCbQuery();
  if (data === "price") {
    const msg = await getTokenPrice();
    return ctx.editMessageText(msg, { parse_mode: "Markdown" });
  }
  const map = {
    about: MESSAGES.about,
    roadmap: MESSAGES.roadmap,
    faq: MESSAGES.faq,
    stats: MESSAGES.stats,
  };
  if (map[data]) ctx.editMessageText(map[data], { parse_mode: "Markdown" });
});

bot.on("text", (ctx) => {
  const text = ctx.message.text.toLowerCase();
  for (const [keywords, key] of Object.entries(RESPONSES.keywordMap)) {
    if (keywords.split("|").some((kw) => text.includes(kw))) {
      return ctx.replyWithMarkdown(pick(RESPONSES[key]));
    }
  }
  if (ctx.chat.type === "private") {
    ctx.replyWithMarkdown(pick(RESPONSES.generic));
  }
});

cron.schedule("0 0,6,12,18 * * *", async () => {
  const msg = pick(MESSAGES.scheduledPromos);
  for (const chatId of BOT_CONFIG.PROMO_CHANNELS) {
    try {
      await bot.telegram.sendMessage(chatId, msg, { parse_mode: "Markdown" });
    } catch (e) {
      console.error("Erreur promo:", e.message);
    }
  }
});

bot.launch().then(() => {
  console.log("Bot OILFIRE lance !");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

