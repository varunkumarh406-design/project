const yahooFinance = require('yahoo-finance2');

async function test() {
  try {
    const symbol = 'RELIANCE.NS';
    console.log(`Fetching history for ${symbol}...`);
    const history = await yahooFinance.chart(symbol, { interval: '1d', range: '1mo' });
    console.log('History Keys:', Object.keys(history));
    if (history.quotes) {
      console.log('First Quote:', history.quotes[0]);
    } else {
      console.log('No quotes found');
    }
  } catch (err) {
    console.error('Test Error:', err);
  }
}

test();
