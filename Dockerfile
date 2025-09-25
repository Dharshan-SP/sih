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

WORKDIR /app

# Install backend dependencies and security tools
RUN apt-get update && \
    apt-get install -y nmap perl git && \
    git clone https://github.com/sullo/nikto.git /usr/local/nikto

COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend ./backend

COPY --from=builder /app/frontend/dist ./backend/public

RUN useradd -m appuser && chown -R appuser /app
USER appuser

WORKDIR /app/backend
EXPOSE 5000
CMD ["npm", "start"]