
const BOT_CONFIG = {
  PROJECT_NAME:  "OILFIRE",
  TOKEN_SYMBOL:  "OLF",
  TOKEN_ADDRESS: "0x...",
  WEBSITE_URL:   "",
  WHITEPAPER_URL:"",
  TWITTER_URL:   "https://twitter.com/TONPSEUDO",
  PROMO_CHANNELS: [],
  ADMIN_IDS:      [],
  COINGECKO_ID:  "",
};

const MESSAGES = {
  welcome: "👋 Bienvenue *{name}* dans la communauté *OILFIRE* !\n\n🚀 Le token *$OLF* est ton ticket pour l'aventure.\n\nChoisis une option ⬇️",
  about: "🌟 *OILFIRE*\n\n💎 Token : $OLF\n✅ Audit certifié\n✅ Équipe doxxée\n✅ Liquidité lockée 2 ans",
  roadmap: "🗺️ *ROADMAP OILFIRE*\n\n✅ Q1 2025 — Lancement\n✅ Q2 2025 — Audit & DEX\n🔄 Q3 2025 — CEX Tier 2\n⏳ Q4 2025 — Staking 120% APY",
  faq: "❓ *FAQ OILFIRE*\n\n➡️ *Comment acheter $OLF ?*\nVia PancakeSwap ou Uniswap.\n\n➡️ *Contrat audité ?*\nOui, audit complet disponible.\n\n➡️ *Staking disponible ?*\nOui, Q4 2025 avec 120% APY.",
  stats: "📊 *STATS OILFIRE*\n\n👥 Holders : 12,457\n💧 Liquidité : $850,000\n🔥 Tokens brûlés : 487M $OLF",
  scheduledPromos: [
    "🚀 *OILFIRE — LA RÉVOLUTION DEFI !*\n\n💎 $OLF — Le token qui change tout\n👥 12,000+ holders\n\n#Crypto #DeFi #OLF",
    "💎 *POURQUOI $OLF ?*\n\n✅ Audité\n✅ Équipe doxxée\n✅ Liquidité lockée\n✅ Staking 120% APY",
    "🌙 *TO THE MOON — $OLF*\n\n📈 12,457 holders\n💧 $850K liquidité\n🚀 Prochaine étape = x10 !",
  ],
};

const RESPONSES = {
  keywordMap: {
    "prix|price|combien": "priceAnswers",
    "acheter|buy|comment": "buyAnswers",
    "rug|scam|arnaque": "trustAnswers",
    "staking|apy|earn": "stakingAnswers",
    "lune|moon|pump|wagmi": "hypeAnswers",
  },
  priceAnswers: ["💰 Tape /price pour le prix actuel de $OLF !"],
  buyAnswers: ["🛒 Va sur PancakeSwap, cherche $OLF et swap ! 💎"],
  trustAnswers: ["🛡️ OILFIRE est 100% SAFU ! Audité, équipe doxxée, liquidité lockée 2 ans ✅"],
  stakingAnswers: ["💎 Staking $OLF jusqu'à 120% APY — lancement Q4 2025 !"],
  hypeAnswers: ["🚀🌙 LFG ! $OLF TO THE MOON ! 💎 #WAGMI", "🔥 OILFIRE on fire ! 🚀"],
  generic: ["💬 Tape /faq pour en savoir plus sur $OLF ! 🚀"],
};

module.exports = { BOT_CONFIG, MESSAGES, RESPONSES };
