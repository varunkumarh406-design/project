const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const socialRoutes = require('./routes/social');
const tradeRoutes = require('./routes/trade');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate Limiting
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'StockSocial API is running...' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
