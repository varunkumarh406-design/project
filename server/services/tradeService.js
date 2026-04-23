const Trade = require('../models/Trade');
const User = require('../models/User');
const stockService = require('./stockService');

/**
 * Buy stock logic
 * @param {string} userId 
 * @param {string} ticker 
 * @param {number} quantity 
 */
const buyStock = async (userId, ticker, quantity) => {
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

    const result = await Promise.all(Object.entries(holdings)
        .filter(([_, data]) => data.quantity > 0)
        .map(async ([ticker, data]) => {
            const quote = await stockService.getQuote(ticker);
            const currentVal = quote ? quote.price * data.quantity : 0;
            const avgBuyPrice = data.totalCost / data.quantity;
            return {
                ticker,
                shares: data.quantity,
                avgBuyPrice,
                currentPrice: quote ? quote.price : 0,
                pnl: quote ? (quote.price - avgBuyPrice) * data.quantity : 0,
                value: currentVal
            };
        }));

    return result;
};

module.exports = {
    buyStock,
    sellStock,
    getPortfolio
};
