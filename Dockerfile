# Development stage
FROM node:20 AS development

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# --- UPDATE THIS SECTION ---
# Copy BOTH prisma schemas so they are available during the build
COPY prisma ./prisma
COPY prisma-mongo ./prisma-mongo

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# --- UPDATE THIS LINE ---
# Generate BOTH prisma clients using the specific scripts from package.json
# This ensures each client is generated from its correct schema and output path.
RUN pnpm run prisma:generate:postgres && pnpm run mongo:generate

# Copy the rest of the application code for development
COPY . .

# -----------------------------------------------------------------------------

# Builder stage (for production)
FROM node:20 AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# --- UPDATE THIS SECTION ---
# Copy BOTH prisma schemas, just like in the development stage
COPY prisma ./prisma
COPY prisma-mongo ./prisma-mongo

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# --- UPDATE THIS LINE ---
# Generate BOTH prisma clients
RUN pnpm run prisma:generate:postgres && pnpm run mongo:generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Prune development-only dependencies for a smaller image
RUN pnpm prune --prod

# -----------------------------------------------------------------------------

# Production stage
FROM node:20 AS production

WORKDIR /usr/src/app

# Copy only the necessary production artifacts from the builder stage
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

# --- UPDATE THIS SECTION ---
# We also need to copy BOTH prisma schemas for the runtime client
COPY --chown=node:node --from=builder /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=builder /usr/src/app/prisma-mongo ./prisma-mongo

# Start the server
CMD ["node", "dist/main.js"]