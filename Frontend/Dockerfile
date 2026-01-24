# ==========================================
# Frontend Dockerfile - React Vite Application
# ==========================================

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables (passed from docker-compose)
ARG VITE_API_BASE_URL
ARG VITE_VISUALIZER_BASE_URL

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_VISUALIZER_BASE_URL=$VITE_VISUALIZER_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Production image with a simple static server
FROM node:20-alpine

# Install serve to serve static files
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose frontend port (configurable via env)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]
