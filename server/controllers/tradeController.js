const tradeService = require('../services/tradeService');
const Trade = require('../models/Trade');
const User = require('../models/User');
const { getIO } = require('../sockets/socketHandler');

const buy = async (req, res) => {
    const { ticker, quantity } = req.body;
    try {
        const result = await tradeService.buyStock(req.user._id, ticker, parseInt(quantity));
        getIO().to(req.user._id.toString()).emit('portfolio_update', result);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const sell = async (req, res) => {
    const { ticker, quantity } = req.body;
    try {
        const result = await tradeService.sellStock(req.user._id, ticker, parseInt(quantity));
        getIO().to(req.user._id.toString()).emit('portfolio_update', result);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPortfolio = async (req, res, next) => {
    try {
        const portfolio = await tradeService.getPortfolio(req.user._id);
        const user = await User.findById(req.user._id).select('virtualBalance');
        res.json({ holdings: portfolio, virtualBalance: user.virtualBalance });
    } catch (error) {
        next(error);
    }
};

const getLeaderboard = async (req, res) => {
    const users = await User.find().select('name avatar virtualBalance');
    const leaderboard = await Promise.all(users.map(async (u) => {
        const portfolio = await tradeService.getPortfolio(u._id);
        const holdingsValue = portfolio.reduce((acc, h) => acc + h.value, 0);
        return {
            name: u.name,
            avatar: u.avatar,
            totalValue: u.virtualBalance + holdingsValue
        };
    }));
    leaderboard.sort((a, b) => b.totalValue - a.totalValue);
    res.json(leaderboard.slice(0, 10));
};

const getHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const trades = await Trade.find({ user: req.user._id })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json(trades);
};

module.exports = {
    buy,
    sell,
    getPortfolio,
    getLeaderboard,
    getHistory
};
