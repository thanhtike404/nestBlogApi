# Development stage
FROM node:20 AS development

WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema
COPY prisma ./prisma

# Install pnpm
RUN npm install -g pnpm

# Install app dependencies using pnpm.
RUN pnpm install

# Generate prisma client
RUN pnpm exec prisma generate

# Copy the rest of the application code to the container image.
COPY . .

# Builder stage
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# Copy prisma schema
COPY prisma ./prisma

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate prisma client
RUN pnpm exec prisma generate

COPY . .

# Build the application
RUN pnpm run build

# Prune development dependencies
RUN pnpm prune --prod

# Production stage
FROM node:20 AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy the bundled code from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# Start the server
CMD ["node", "dist/main.js"]
