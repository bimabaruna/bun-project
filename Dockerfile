# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.2.5
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun/Prisma"

# Working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# -------- Build Stage --------
FROM base AS build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential openssl pkg-config python-is-python3

# Install backend dependencies
COPY bun.lock package-lock.json package.json ./
RUN bun install --ci

# Generate Prisma Client
COPY api/prisma ./prisma
RUN bunx prisma generate

# Copy backend code
COPY api ./api

# Copy built frontend (already built locally before deploy)
COPY frontend/dist ./dist


# -------- Final Runtime Image --------
FROM base

# Only add minimal required packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built app from build stage
COPY --from=build /app /app

# Expose API port
EXPOSE 3000

# Start Bun server (main index.ts must be at /app/api/index.ts)
CMD [ "bun", "run", "api/index.ts" ]