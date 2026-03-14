const { BOT_CONFIG } = require("./config");

async function getTokenPrice() {
  const coinId  = BOT_CONFIG.COINGECKO_ID;
  const symbol  = BOT_CONFIG.TOKEN_SYMBOL;
  const project = BOT_CONFIG.PROJECT_NAME;

  if (!coinId) {
    return (
      `💰 *PRIX DE $${symbol}*\n\n` +
      `⏳ Le token n'est pas encore listé sur CoinGecko.\n` +
      `📌 Le prix sera disponible après le listing.\n\n` +
      `🔔 Suis ${project} sur Twitter pour l'annonce !`
    );
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true`;
    const res  = await fetch(url);
    const json = await res.json();
    const data = json[coinId];
    if (!data) throw new Error("Token introuvable");

    const { usd, eur, usd_24h_change, usd_market_cap } = data;
    const trend = usd_24h_change >= 0 ? "📈" : "📉";
    const sign  = usd_24h_change >= 0 ? "+" : "";
    const mc    = usd_market_cap >= 1_000_000
      ? `$${(usd_market_cap/1_000_000).toFixed(2)}M`
      : `$${(usd_market_cap/1_000).toFixed(1)}K`;

    return (
      `💰 *PRIX DE $${symbol}*\n\n` +
      `💵 USD : *$${usd.toFixed(8)}*\n` +
      `💶 EUR : *€${eur.toFixed(8)}*\n\n` +
      `${trend} 24h : *${sign}${usd_24h_change.toFixed(2)}%*\n` +
      `💧 Market Cap : *${mc}*\n\n` +
      `📡 Source : CoinGecko`
    );
  } catch (e) {
    return `⚠️ Impossible de récupérer le prix de $${symbol}.`;
  }
}

module.exports = { getTokenPrice };
