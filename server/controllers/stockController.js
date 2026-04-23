const stockService = require('../services/stockService');
const Watchlist = require('../models/Watchlist');

const searchStocks = async (req, res, next) => {
    try {
        const results = await stockService.searchStocks(req.query.q);
        res.json(results);
    } catch (error) {
        next(error);
    }
};

const getQuote = async (req, res) => {
    const quote = await stockService.getQuote(req.params.ticker);
    if (!quote) return res.status(404).json({ message: 'Stock not found' });
    res.json(quote);
};

const getHistory = async (req, res) => {
    const history = await stockService.getHistory(req.params.ticker);
    if (!history) return res.status(404).json({ message: 'History not found' });
    res.json(history);
};

const addToWatchlist = async (req, res) => {
    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) {
        watchlist = await Watchlist.create({ user: req.user._id, tickers: [] });
    }
    if (!watchlist.tickers.includes(req.body.ticker)) {
        watchlist.tickers.push(req.body.ticker);
        await watchlist.save();
    }
    res.json(watchlist);
};

const getWatchlist = async (req, res, next) => {
    try {
        const watchlist = await Watchlist.findOne({ user: req.user._id });
        if (!watchlist) return res.json([]);
        
        const results = await Promise.all(watchlist.tickers.map(async (ticker) => {
            try {
                const quote = await stockService.getQuote(ticker);
                return quote || { symbol: ticker, price: 0, change: 0, changePercent: '0%', name: ticker };
            } catch (err) {
                return { symbol: ticker, price: 0, change: 0, changePercent: '0%', name: ticker };
            }
        }));
        
        res.json(results);
    } catch (error) {
        next(error);
    }
};

const removeFromWatchlist = async (req, res) => {
    const watchlist = await Watchlist.findOne({ user: req.user._id });
    if (watchlist) {
        watchlist.tickers = watchlist.tickers.filter(t => t !== req.params.ticker);
        await watchlist.save();
    }
    res.json(watchlist);
};

module.exports = {
    searchStocks,
    getQuote,
    getHistory,
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
};
