# StockSocial Deployment Guide

This document provides step-by-step instructions for deploying the StockSocial Trading Platform to a production environment (e.g., AWS, DigitalOcean, or Render).

## 🚀 Infrastructure Requirements
- **Node.js**: v18.x or higher
- **MongoDB**: Atlas (Recommended) or self-hosted v6.0+
- **Redis**: v6.2+ for caching market data
- **Cloudinary**: For hosting user avatars and trade screenshots

## 🔑 Environment Variables
You must configure the following variables in your production environment:

### Backend (`/server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_key
REDIS_URL=your_redis_connection_string
ALPHA_VANTAGE_KEY=your_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend (`/client/.env`)
```env
VITE_API_URL=https://api.your-domain.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Deployment Options

### Option 1: Render (Recommended)
This project includes a `render.yaml` for automated deployment.

1. **Push your code** to GitHub or GitLab.
2. **Connect to Render**: Log in to [Render.com](https://render.com) and click "Blueprints" -> "New Blueprint Instance".
3. **Connect Repository**: Select your StockSocial repository.
4. **Configure Environment**:
   - Render will automatically detect `render.yaml`.
   - You will need to provide `MONGO_URI` (e.g., from MongoDB Atlas) in the Render dashboard.
   - The `VITE_API_URL` for the client should point to your backend service URL (e.g., `https://stocksocial-api.onrender.com/api`).

### Option 2: Docker (Local / VPS)
You can run the entire stack using Docker Compose.

```bash
docker-compose up --build
```

- **Frontend**: http://localhost
- **Backend**: http://localhost:5000

---

## 🛡️ Production Checklist
- [ ] **Database**: Use MongoDB Atlas for a reliable production database.
- [ ] **Environment Variables**: Ensure `JWT_SECRET`, `MONGO_URI`, and `REDIS_URL` are set.
- [ ] **CORS**: Update `CLIENT_URL` in the backend to match your frontend production domain.
- [ ] **Vite API URL**: Ensure `VITE_API_URL` is set correctly during the client build.

---

## 📈 Scaling
- **WebSocket Scaling**: If you scale to multiple server instances, use a Redis adapter for Socket.io.
- **Caching**: The multi-layer cache (Memory + Redis) is already optimized for high traffic.
