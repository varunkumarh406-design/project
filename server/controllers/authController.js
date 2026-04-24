const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    try {
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                virtualBalance: user.virtualBalance,
                token: generateToken(user._id)
            });
        }
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(400);
        throw new Error(err.message || 'Invalid user data');
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            virtualBalance: user.virtualBalance,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
};

// @desc    Login with Google
// @route   POST /api/auth/google
// @access  Public
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    const { tokenId } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create user if doesn't exist
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-10), // Random password for OAuth users
                avatar: picture
            });
        } else {
            // Update avatar if it's missing or changed in Google
            if (picture && user.avatar !== picture) {
                user.avatar = picture;
                await user.save();
            }
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            virtualBalance: user.virtualBalance,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin
};
