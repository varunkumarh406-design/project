const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers', 'name avatar')
        .populate('following', 'name avatar');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Update user profile
// @route   PUT /api/users/update
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.avatar = req.body.avatar || user.avatar;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            token: req.headers.authorization.split(' ')[1]
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
const followUser = async (req, res, next) => {
    try {
        let targetId = req.params.id;
        if (targetId.includes(':')) targetId = targetId.split(':')[0]; // Strip :1 or similar
        
        console.log(`[DEBUG] Attempting to follow user: ${targetId} by ${req.user._id}`);
        const userToFollow = await User.findById(targetId);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const isFollowing = currentUser.following.includes(userToFollow._id);

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser._id.toString());
            await currentUser.save();
            await userToFollow.save();
            res.json({ message: 'Unfollowed successfully' });
        } else {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            await currentUser.save();
            await userToFollow.save();
            res.json({ message: 'Followed successfully' });
        }
    } catch (error) {
        console.error('[DEBUG] followUser Error:', error);
        next(error);
    }
};

// @desc    Get user suggestions (who to follow)
// @route   GET /api/users/suggestions
// @access  Private
const getSuggestions = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const excludeIds = [...user.following, req.user._id];

        const suggestions = await User.find({ _id: { $nin: excludeIds } })
            .select('name avatar bio followers')
            .limit(5);

        res.json(suggestions);
    } catch (error) {
        console.error('[DEBUG] getSuggestions Error:', error);
        next(error);
    }
};

// @desc    Search users
// @route   GET /api/users/search/:query
// @access  Private
const searchUsers = async (req, res, next) => {
    try {
        const query = req.params.query;
        const users = await User.find({
            name: { $regex: query, $options: 'i' },
            _id: { $ne: req.user._id }
        })
        .select('name avatar bio followers following')
        .limit(10);
        res.json(users);
    } catch (error) {
        console.error('[DEBUG] searchUsers Error:', error);
        next(error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    getSuggestions,
    searchUsers
};
