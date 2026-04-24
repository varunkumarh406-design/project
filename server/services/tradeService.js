const Trade = require('../models/Trade');
const User = require('../models/User');
const stockService = require('./stockService');

const isMarketOpen = () => {
    const now = new Date();
    // Indian Standard Time (IST) is UTC+5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
    
    const day = istTime.getDay();
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    
    // Weekends (0: Sunday, 6: Saturday)
    if (day === 0 || day === 6) return false;
    
    const currentTime = hours * 60 + minutes;
    const openTime = 9 * 0; // 9:00 AM
    const closeTime = 15 * 60 + 30; // 3:30 PM
    
    return currentTime >= openTime && currentTime <= closeTime;
};

/**
 * Buy stock logic
 * @param {string} userId 
 * @param {string} ticker 
 * @param {number} quantity 
 */
const buyStock = async (userId, ticker, quantity) => {
    if (!isMarketOpen()) throw new Error('Trading is only allowed between 9:00 AM and 3:30 PM IST');
    
    const user = await User.findById(userId);
    const quote = await stockService.getQuote(ticker);

    if (!quote) throw new Error('Invalid ticker or price unavailable');

    const totalCost = quote.price * quantity;
    if (user.virtualBalance < totalCost) throw new Error('Insufficient virtual balance');

    user.virtualBalance -= totalCost;
    await user.save();

    const trade = await Trade.create({
        user: userId,
        ticker,
        action: 'buy',
        quantity,
        priceAtTrade: quote.price
    });

    return { trade, virtualBalance: user.virtualBalance };
};

/**
 * Sell stock logic
 * @param {string} userId 
 * @param {string} ticker 
 * @param {number} quantity 
 */
const sellStock = async (userId, ticker, quantity) => {
    if (!isMarketOpen()) throw new Error('Trading is only allowed between 9:00 AM and 3:30 PM IST');
    
    const user = await User.findById(userId);
    
    // Check holdings
    const trades = await Trade.find({ user: userId, ticker });
    const netQuantity = trades.reduce((acc, t) => acc + (t.action === 'buy' ? t.quantity : -t.quantity), 0);

    if (netQuantity < quantity) throw new Error('Insufficient holdings to sell');

    const quote = await stockService.getQuote(ticker);
    if (!quote) throw new Error('Price unavailable');

    user.virtualBalance += quote.price * quantity;
    await user.save();

    const trade = await Trade.create({
        user: userId,
        ticker,
        action: 'sell',
        quantity,
        priceAtTrade: quote.price
    });

    return { trade, virtualBalance: user.virtualBalance };
};

/**
 * Calculate portfolio details
 * @param {string} userId 
 */
const getPortfolio = async (userId) => {
    const trades = await Trade.find({ user: userId });
    const holdings = {};

    trades.forEach(t => {
        if (!holdings[t.ticker]) {
            holdings[t.ticker] = { quantity: 0, totalCost: 0 };
        }
        if (t.action === 'buy') {
            holdings[t.ticker].quantity += t.quantity;
            holdings[t.ticker].totalCost += t.quantity * t.priceAtTrade;
        } else {
            const avgCost = holdings[t.ticker].totalCost / holdings[t.ticker].quantity;
            holdings[t.ticker].quantity -= t.quantity;
            holdings[t.ticker].totalCost -= t.quantity * avgCost;
        }
    });

    const activeTickers = Object.keys(holdings).filter(ticker => holdings[ticker].quantity > 0);
    
    // Batch fetch all quotes at once
    const quotes = await stockService.getQuotes(activeTickers);
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]));

    const result = activeTickers.map(ticker => {
        const data = holdings[ticker];
        const quote = quoteMap.get(ticker);
        const currentPrice = quote ? quote.price : 0;
        const currentVal = currentPrice * data.quantity;
        const avgBuyPrice = data.totalCost / data.quantity;
        
        return {
            ticker,
            shares: data.quantity,
            avgBuyPrice,
            currentPrice,
            pnl: (currentPrice - avgBuyPrice) * data.quantity,
            value: currentVal
        };
    });

    return result;
};

module.exports = {
    buyStock,
    sellStock,
    getPortfolio
};
