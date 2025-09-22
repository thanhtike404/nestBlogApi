# Development stage
FROM node:20 AS development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm
RUN pnpm install

# Generate prisma client, but do not migrate
RUN pnpm exec prisma generate

COPY . .

# Builder stage (for production)
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm

# Install ALL dependencies first to build the app
RUN pnpm install --frozen-lockfile

# Generate prisma client
RUN pnpm exec prisma generate

COPY . .

# Build the application
RUN pnpm run build

# Prune development-only dependencies for a smaller image
RUN pnpm prune --prod

# Production stage
FROM node:20 AS production

WORKDIR /usr/src/app

# Copy only the necessary production artifacts from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
# We also need to copy the prisma schema for the runtime client
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma

# Start the server
CMD ["node", "dist/main.js"]
