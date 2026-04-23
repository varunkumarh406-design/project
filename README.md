# Social Trading Platform Backend

A production-ready backend for a social trading platform built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- **JWT Authentication**: Secure register and login.
- **User Profiles**: Manage bio, avatar, and social connections (followers/following).
- **Trade Sharing**: Post buy/sell trades with stock symbols, prices, and quantities.
- **Social Interaction**: Like and comment on trades in real-time.
- **Portfolio Tracking**: Automatic updates of user holdings based on trade activity.
- **Leaderboard**: Real-time ranking of top traders based on performance.
- **Real-time Updates**: Instant notifications for new trades, likes, and comments using Socket.IO.

## Tech Stack

- **Node.js & Express**: Backend framework.
- **MongoDB & Mongoose**: Database and ODM.
- **Socket.IO**: Real-time bidirectional communication.
- **JWT**: Token-based authentication.
- **Helmet & CORS**: Security and cross-origin resource sharing.
- **Morgan**: HTTP request logging.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create .env as described below
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Configuration

### Backend (server/.env)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend
The frontend is pre-configured to connect to `http://localhost:5000/api`. If your backend port differs, update `client/src/api/api.js` and `client/src/context/TradeContext.jsx`.

## API Documentation

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and get a token.

### Users
- `GET /api/users/:id`: Get user profile (Protected).
- `PUT /api/users/update`: Update own profile (Protected).
- `POST /api/users/follow/:id`: Follow or unfollow a user (Protected).

### Trades
- `POST /api/trades`: Create a new trade (Protected).
- `GET /api/trades/feed`: Get trade feed from followed users (Protected).
- `POST /api/trades/:id/like`: Like or unlike a trade (Protected).
- `POST /api/trades/:id/comment`: Comment on a trade (Protected).

### Leaderboard
- `GET /api/leaderboard`: Get top traders.

## Real-time Events (Socket.IO)

- `new_trade`: Emitted when a new trade is posted.
- `like_trade`: Emitted when a trade is liked.
- `comment_trade`: Emitted when a comment is added.

## Folder Structure

```
server/       # Backend files
  config/     # Database configuration
  controllers/# Business logic
  models/     # Mongoose schemas
  routes/     # API endpoints
  middleware/ # Auth and Error handlers
  sockets/    # Socket.IO logic
client/       # Frontend files (React + Vite)
```