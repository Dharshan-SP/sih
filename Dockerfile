# ------------------------
# Frontend build stage
# ------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install tools needed for building
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy source and build
COPY frontend ./frontend

# Fix permissions for vite binary
RUN chmod +x ./frontend/node_modules/.bin/vite

RUN cd frontend && npx vite build

# ------------------------
# Backend stage
# ------------------------
FROM node:22-slim

WORKDIR /app/backend

# Install system dependencies and tools
RUN apt-get update && \
    apt-get install -y nmap perl git && \
    git clone https://github.com/sullo/nikto.git /usr/local/nikto && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend ./

# Copy frontend build into backend/public
COPY --from=builder /app/frontend/dist ./public

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 5000

CMD ["npm", "start"]
