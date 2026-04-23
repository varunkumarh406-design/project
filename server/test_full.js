const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const symbol = 'RELIANCE.NS';
    console.log(`Testing Yahoo Quote for ${symbol}...`);
    const quote = await yahooFinance.quote(symbol);
    console.log('Quote Symbol:', quote.symbol);
    console.log('Quote Price:', quote.regularMarketPrice);
    
    console.log(`Testing Yahoo Historical for ${symbol}...`);
    const history = await yahooFinance.historical(symbol, { period1: new Date('2024-01-01'), interval: '1d' });
    console.log('History Count:', history.length);
  } catch (err) {
    console.error('Yahoo Test Error:', err);
  }
}

test();
