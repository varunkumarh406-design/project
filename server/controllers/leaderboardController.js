const User = require('../models/User');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');

// @desc    Get top traders based on profit (mock logic for demo)
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        // For a production app, you'd calculate actual profit from closed trades
        // and current portfolio value vs cost.
        // Here, we'll calculate a simple "Score" based on trade volume and successful sells
        
        const users = await User.find({}).select('name avatar');
        
        const leaderboard = await Promise.all(users.map(async (user) => {
            const trades = await Trade.find({ user: user._id });
            const portfolio = await Portfolio.findOne({ user: user._id });
            
            let totalVolume = trades.reduce((acc, trade) => acc + (trade.price * trade.quantity), 0);
            let tradeCount = trades.length;
            
            // Mock profit calculation: Sell trades that are "higher" than some base or just random for variety
            // In reality, you'd track cost basis for each trade.
            let mockProfit = trades
                .filter(t => t.type === 'SELL')
                .reduce((acc, t) => acc + (t.price * 0.1 * t.quantity), 0); // Assuming 10% profit on sells for demo
            
            return {
                _id: user._id,
                name: user.name,
                avatar: user.avatar,
                profit: parseFloat(mockProfit.toFixed(2)),
                volume: parseFloat(totalVolume.toFixed(2)),
                tradeCount
            };
        }));

        // Sort by profit descending
        leaderboard.sort((a, b) => b.profit - a.profit);

        res.json(leaderboard.slice(0, 10)); // Top 10
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching leaderboard');
    }
};

module.exports = {
    getLeaderboard
};
