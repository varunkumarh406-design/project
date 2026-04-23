const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile/:id', protect, userController.getUserProfile);
router.put('/update', protect, userController.updateUserProfile);
router.post('/follow/:id', protect, userController.followUser);
router.get('/suggestions', protect, userController.getSuggestions);

module.exports = router;
