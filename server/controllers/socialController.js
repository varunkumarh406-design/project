const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { getIO } = require('../sockets/socketHandler');

const getFeed = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const posts = await Post.find()
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json(posts);
};

const createPost = async (req, res) => {
    const { body, ticker } = req.body;
    const post = await Post.create({
        author: req.user._id,
        body,
        ticker
    });
    const populatedPost = await Post.findById(post._id).populate('author', 'name avatar');
    getIO().emit('new_post', populatedPost);
    res.status(201).json(populatedPost);
};

const toggleLike = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
        post.likes.push(req.user._id);
    } else {
        post.likes.splice(index, 1);
    }
    await post.save();
    res.json(post.likes);
};

const addComment = async (req, res) => {
    const { body, isTip } = req.body;
    const comment = await Comment.create({
        post: req.params.id,
        author: req.user._id,
        body,
        isTip
    });
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar');
    getIO().emit('new_comment', { postId: req.params.id, comment: populatedComment });
    res.status(201).json(populatedComment);
};

const getComments = async (req, res) => {
    const comments = await Comment.find({ post: req.params.id })
        .populate('author', 'name avatar')
        .sort({ createdAt: 1 });
    res.json(comments);
};

module.exports = {
    getFeed,
    createPost,
    toggleLike,
    addComment,
    getComments
};
