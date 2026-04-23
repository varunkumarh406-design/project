const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        const symbol = 'SAGILITY.NS';
        console.log(`Testing ${symbol} with chart()...`);
        const result = await yahooFinance.chart(symbol, { 
            period1: '2024-11-01', 
            interval: '1d' 
        });
        console.log(`Quotes length: ${result.quotes.length}`);
        if (result.quotes.length > 0) {
            console.log('First quote:', result.quotes[0]);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
