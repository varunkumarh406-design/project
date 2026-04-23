const express = require('express');
const router = express.Router();
const { buy, sell, getPortfolio, getLeaderboard, getHistory } = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);

// Protected
router.use(protect);
router.post('/buy', buy);
router.post('/sell', sell);
router.get('/portfolio', getPortfolio);
router.get('/history', getHistory);

module.exports = router;
