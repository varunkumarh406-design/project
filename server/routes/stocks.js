const express = require('express');
const router = express.Router();
const { searchStocks, getQuote, getHistory, addToWatchlist, getWatchlist, removeFromWatchlist } = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

router.get('/search', searchStocks);
router.get('/quote/:ticker', getQuote);
router.get('/history/:ticker', getHistory);

// Protected
router.use(protect);
router.post('/watchlist', addToWatchlist);
router.get('/watchlist', getWatchlist);
router.delete('/watchlist/:ticker', removeFromWatchlist);

module.exports = router;
