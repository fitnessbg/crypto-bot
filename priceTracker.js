
async function getXAUTPrice() {
  try {
    const res = await fetch("https://api.mexc.com/api/v3/ticker/24hr?symbol=XAUTUSDT");
    const d = await res.json();
    const price = parseFloat(d.lastPrice);
    const change = parseFloat(d.priceChangePercent);
    const trend = change >= 0 ? "📈" : "📉";
    const sign = change >= 0 ? "+" : "";
    return `💛 *XAUT/USDT*\n\n💵 Prix : *$${price.toFixed(2)}*\n${trend} 24h : *${sign}${change.toFixed(2)}%*\n\n📡 Source : MEXC`;
  } catch (e) {
    return "⚠️ Impossible de récupérer XAUT.";
  }
}

async function getOilPrice(symbol) {
  try {
    const ids = symbol === "WTI" ? "wrapped-bitcoin" : "ethereum"; // remplacé après
    // On utilise une API gratuite pour le pétrole
    const res = await fetch(`https://api.mexc.com/api/v3/ticker/24hr?symbol=${symbol === "WTI" ? "WTIUSDT" : "BRENTUSDT"}`);
    const d = await res.json();
    const price = parseFloat(d.lastPrice);
    const change = parseFloat(d.priceChangePercent);
    const trend = change >= 0 ? "📈" : "📉";
    const sign = change >= 0 ? "+" : "";
    const emoji = symbol === "WTI" ? "🛢️" : "⛽";
    return `${emoji} *${symbol}/USDT*\n\n💵 Prix : *$${price.toFixed(2)}*\n${trend} 24h : *${sign}${change.toFixed(2)}%*\n\n📡 Source : MEXC`;
  } catch (e) {
    return `⚠️ Impossible de récupérer ${symbol}.`;
  }
}

async function getSignalXAUT() {
  try {
    // Fetch 30 dernières bougies 15m XAUT
    const res = await fetch("https://api.mexc.com/api/v3/klines?symbol=XAUTUSDT&interval=15m&limit=30");
    const candles = await res.json();
    const closes = candles.map(c => parseFloat(c[4]));

    // MA5 et MA10
    const ma5 = closes.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const ma10 = closes.slice(-10).reduce((a, b) => a + b, 0) / 10;

    // RSI14
    const gains = [], losses = [];
    for (let i = closes.length - 14; i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains.push(diff); else losses.push(Math.abs(diff));
    }
    const avgGain = gains.reduce((a, b) => a + b, 0) / 14;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / 14;
    const rs = avgGain / (avgLoss || 1);
    const rsi = 100 - (100 / (1 + rs));

    const price = closes[closes.length - 1];
    const signal = ma5 > ma10 ? "🟢 LONG" : "🔴 SHORT";
    const rsiZone = rsi > 70 ? "⚠️ Surachat" : rsi < 30 ? "⚠️ Survente" : "✅ Neutre";

    return (
      `📊 *SIGNAL XAUT/USDT 15m*\n\n` +
      `💵 Prix : *$${price.toFixed(2)}*\n` +
      `📉 MA5 : *${ma5.toFixed(2)}*\n` +
      `📉 MA10 : *${ma10.toFixed(2)}*\n` +
      `📊 RSI14 : *${rsi.toFixed(1)}* ${rsiZone}\n\n` +
      `🎯 Signal : *${signal}*`
    );
  } catch (e) {
    return "⚠️ Impossible de calculer le signal.";
  }
}

module.exports = { getXAUTPrice, getOilPrice, getSignalXAUT };
