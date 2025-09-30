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

WORKDIR /tools

# Install system dependencies and tools
RUN apt-get update && \
    apt-get install -y nmap perl git && \
    git clone https://github.com/sullo/nikto.git /usr/local/nikto && \
    rm -rf /var/lib/apt/lists/*

# Install Recon-ng
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install recon-ng && \
    rm -rf /var/lib/apt/lists/*

# Set default shell
CMD ["/bin/bash"]
