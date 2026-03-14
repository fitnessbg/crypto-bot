const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const { getTokenPrice } = require("./priceTracker");
const { MESSAGES, RESPONSES, BOT_CONFIG } = require("./config");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

bot.start((ctx) => {
  const name = ctx.from.first_name || "ami";
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🚀 Notre Projet", "about"), Markup.button.callback("💰 Prix Token", "price")],
    [Markup.button.callback("🗺️ Roadmap", "roadmap"), Markup.button.callback("👥 Communauté", "community")],
    [Markup.button.callback("❓ FAQ", "faq"), Markup.button.callback("📊 Stats", "stats")],
  ]);
  ctx.replyWithMarkdown(MESSAGES.welcome.replace("{name}", name), keyboard);
});

bot.command("price", async (ctx) => {
  ctx.reply("⏳ Récupération du prix...");
  const msg = await getTokenPrice();
  ctx.replyWithMarkdown(msg);
});

bot.command("roadmap", (ctx) => ctx.replyWithMarkdown(MESSAGES.roadmap));
bot.command("faq", (ctx) => ctx.replyWithMarkdown(MESSAGES.faq));
bot.command("stats", (ctx) => ctx.replyWithMarkdown(MESSAGES.stats));
bot.command("community", (ctx) => ctx.replyWithMarkdown(MESSAGES.community));

bot.command("announce", async (ctx) => {
  if (!BOT_CONFIG.ADMIN_IDS.includes(ctx.from.id)) return ctx.reply("⛔ Admins seulement.");
  const text = ctx.message.text.replace("/announce", "").trim();
  if (!text) return ctx.reply("Usage : /announce <message>");
  const msg = `📢 *ANNONCE OFFICIELLE*\n\n${text}\n\n— *${BOT_CONFIG.PROJECT_NAME} Team*`;
  for (const chatId of BOT_CONFIG.PROMO_CHANNELS) {
    try { await bot.telegram.sendMessage(chatId, msg, { parse_mode: "Markdown" }); } catch(e) {}
  }
  ctx.reply("✅ Annonce envoyée !");
});

bot.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  await ctx.answerCbQuery();
  if (data === "price") {
    const msg = await getTokenPrice();
    return ctx.editMessageText(msg, { parse_mode: "Markdown" });
  }
  const map = { about: MESSAGES.about, roadmap: MESSAGES.roadmap, faq: MESSAGES.faq, community: MESSAGES.community, stats: MESSAGES.stats };
  if (map[data]) ctx.editMessageText(map[data], { parse_mode: "Markdown" });
});

bot.on("text", (ctx) => {
  const text = ctx.message.text.toLowerCase();
  for (const [keywords, key] of Object.entries(RESPONSES.keywordMap)) {
    if (keywords.split("|").some(kw => text.includes(kw))) {
      return ctx.replyWithMarkdown(pick(RESPONSES[key]));
    }
  }
  if (ctx.chat.type === "private") ctx.replyWithMarkdown(pick(RESPONSES.generic));
});

cron.schedule("0 0,6,12,18 * * *", async () => {
  const msg = pick(MESSAGES.scheduledPromos);
  for (const chatId of BOT_CONFIG.PROMO_CHANNELS) {
    try { await bot.telegram.sendMessage(chatId, msg, { parse_mode: "Markdown" }); } catch(e) {}
  }
});

bot.launch().then(() => console.log(`🚀 Bot ${BOT_CONFIG.PROJECT_NAME} lancé !`));
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop
