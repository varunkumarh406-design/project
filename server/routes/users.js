const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, followUser, getSuggestions, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/suggestions', protect, getSuggestions);
router.get('/search/:query', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);
router.post('/follow/:id', protect, followUser);

module.exports = router;
