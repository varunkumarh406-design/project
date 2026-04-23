const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        const symbol = 'SAGILITY.NS';
        console.log(`Testing ${symbol}...`);
        const history = await yahooFinance.historical(symbol, { 
            period1: '2024-11-01', 
            interval: '1d' 
        });
        console.log(`History length: ${history.length}`);
        if (history.length > 0) {
            console.log('First candle:', history[0]);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
