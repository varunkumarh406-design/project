const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEMO_USER = {
    name: 'TraderX',
    email: 'traderx@stocksocial.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TraderX',
    virtualBalance: 100000,
};

const ensureDemoUserExists = async () => {
    let user = await User.findOne({ email: DEMO_USER.email.toLowerCase() });

    if (!user) {
        user = await User.create({
            name: DEMO_USER.name,
            email: DEMO_USER.email.toLowerCase(),
            password: DEMO_USER.password,
            avatar: DEMO_USER.avatar,
            virtualBalance: DEMO_USER.virtualBalance,
        });
    }

    return user;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
    }

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
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    let user = await User.findOne({ email });
    const isDemoLogin = email === DEMO_USER.email && password === DEMO_USER.password;

    if (isDemoLogin) {
        user = await ensureDemoUserExists();
    }

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
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

    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(400).json({ message: 'Google login is not configured yet' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            user = await User.create({
                name,
                email: email.toLowerCase(),
                password: Math.random().toString(36).slice(-10),
                avatar: picture
            });
        } else {
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
