const express = require('express');
const router = express.Router();
const { getFeed, createPost, toggleLike, addComment, getComments } = require('../controllers/socialController');
const { protect } = require('../middleware/auth');

router.get('/feed', getFeed);
router.get('/post/:id/comments', getComments);

// Protected
router.use(protect);
router.post('/post', createPost);
router.post('/post/:id/like', toggleLike);
router.post('/post/:id/comment', addComment);

module.exports = router;
