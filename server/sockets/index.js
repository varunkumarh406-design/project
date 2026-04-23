const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

const emitNewTrade = (trade) => {
    if (io) io.emit('new_trade', trade);
};

const emitLikeTrade = (data) => {
    if (io) io.emit('like_trade', data);
};

const emitCommentTrade = (data) => {
    if (io) io.emit('comment_trade', data);
};

module.exports = {
    initSocket,
    getIO,
    emitNewTrade,
    emitLikeTrade,
    emitCommentTrade
};
