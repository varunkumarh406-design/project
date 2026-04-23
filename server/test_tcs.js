const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const symbol = 'TCS.NS';
    console.log(`Testing Yahoo Chart for ${symbol}...`);
    const history = await yahooFinance.chart(symbol, { interval: '1d', range: '1mo' });
    console.log('Result Quotes Count:', history.quotes ? history.quotes.length : 'null');
    if (history.quotes && history.quotes.length > 0) {
        console.log('First Candle:', history.quotes[0]);
    }
  } catch (err) {
    console.error('Yahoo Test Error:', err);
  }
}

test();
