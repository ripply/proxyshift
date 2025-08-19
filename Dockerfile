# Use Node.js 10 (last version compatible with old graceful-fs)
FROM node:10-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Copy package.json first for better Docker layer caching
COPY package.json ./

# Install dependencies with legacy npm settings (skip sqlite3 for PostgreSQL)
RUN npm install --production --unsafe-perm || npm install --production --unsafe-perm --ignore-scripts

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p data

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
