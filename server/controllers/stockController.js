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
        if (!watchlist || watchlist.tickers.length === 0) return res.json([]);
        
        // Use high-speed batch fetching
        const results = await stockService.getQuotes(watchlist.tickers);
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
