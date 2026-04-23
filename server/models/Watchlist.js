const mongoose = require('mongoose');

const watchlistSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    tickers: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
