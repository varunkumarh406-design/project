# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ .

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
