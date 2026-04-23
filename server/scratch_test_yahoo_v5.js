const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const symbol = 'RELIANCE.NS';
    console.log(`Fetching quote for ${symbol}...`);
    const quote = await yahooFinance.quote(symbol);
    console.log('Quote:', quote.symbol, quote.regularMarketPrice);
  } catch (err) {
    console.error('Test Error:', err);
  }
}

test();
