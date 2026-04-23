const yf = require('yahoo-finance2').default;

async function test() {
  try {
    const symbol = 'RELIANCE.NS';
    console.log(`Fetching quote for ${symbol}...`);
    // Some versions require this if not using the default export correctly
    const quote = await yf.quote(symbol);
    console.log('Quote:', quote.symbol, quote.regularMarketPrice);
  } catch (err) {
    console.error('Test Error:', err);
  }
}

test();
