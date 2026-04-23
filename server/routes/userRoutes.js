const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, followUser, getSuggestions } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/suggestions', protect, getSuggestions);
router.get('/:id', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);
router.post('/follow/:id', protect, followUser);

module.exports = router;
