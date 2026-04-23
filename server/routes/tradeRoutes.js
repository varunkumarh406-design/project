const express = require('express');
const router = express.Router();
const { createTrade, getTradeFeed, likeTrade, commentTrade } = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTrade);
router.get('/feed', protect, getTradeFeed);
router.post('/:id/like', protect, likeTrade);
router.post('/:id/comment', protect, commentTrade);

module.exports = router;
