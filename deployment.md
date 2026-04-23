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

## 🛠️ Deployment Steps

### 1. Build the Frontend
Vite generates highly optimized static files for production.
```bash
cd client
npm install
npm run build
```
The output will be in the `client/dist` folder. You can host this on **Vercel**, **Netlify**, or an **S3 bucket**.

### 2. Deploy the Backend
1. **Transfer Files**: Upload the `server` folder to your server.
2. **Install Deps**: `npm install --production`
3. **Start with PM2**: Use a process manager like PM2 to keep the server running.
```bash
npm install -g pm2
pm2 start server.js --name stocksocial-api
```

### 3. Nginx Configuration (Reverse Proxy)
If you are using a VPS, use Nginx to route traffic and handle SSL.
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🛡️ Production Checklist
- [ ] **SSL Certificates**: Use Let's Encrypt (Certbot) for HTTPS.
- [ ] **Database Backups**: Enable automated backups in MongoDB Atlas.
- [ ] **Rate Limiting**: The built-in rate limiter is active; monitor logs for `429` errors.
- [ ] **Redis Connection**: Ensure the server has firewall access to the Redis port (6379).
- [ ] **CORS**: Verify `CLIENT_URL` matches your frontend domain exactly.

---

## 📈 Scaling
- **WebSocket Scaling**: If you scale to multiple server instances, use a Redis adapter for Socket.io.
- **Caching**: The multi-layer cache (Memory + Redis) is already optimized for high traffic.
