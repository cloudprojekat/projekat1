# =============================================
# STAGE 1: Builder (installs ALL dependencies)
# =============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./

# Install ALL deps including devDependencies (needed for build/test)
RUN npm ci

# Copy source code
COPY src/ ./src/

# =============================================
# STAGE 2: Production (minimal final image)
# =============================================
FROM node:18-alpine AS production

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy source from builder stage
COPY --from=builder /app/src ./src

# Change ownership to non-root user
RUN chown -R appuser:nodejs /app

USER appuser

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]