const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    // Authentication middleware for Socket.IO
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.user = decoded;
                next();
            } catch (err) {
                console.error('Socket Auth Error:', err.message);
                next(new Error('Authentication error'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected to socket:', socket.user.id);

        // Join a private room for the user to receive specific updates (like portfolio changes)
        socket.join(socket.user.id);

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.id);
        });
    });

    // Simulate real-time stock updates for active tickers
    setInterval(() => {
        const tickers = ['AAPL', 'TSLA', 'NVDA', 'RELIANCE.NSE', 'TCS.NSE'];
        const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
        const mockUpdate = {
            symbol: randomTicker,
            price: (150 + Math.random() * 1000).toFixed(2),
            changePercent: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2).toFixed(2) + '%'
        };
        io.emit('stock_price_update', mockUpdate);
    }, 10000); // Every 10 seconds

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initSocket,
    getIO
};
