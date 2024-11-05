# Stage 1: Dependencies and Build
FROM node:18.17-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies including 'devDependencies'
RUN npm ci

# Copy source code
COPY . .

# Generate prisma client and build application
RUN npm run build

# Stage 2: Production
FROM node:18.17-alpine AS production

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy necessary configuration files
COPY --from=builder /usr/src/app/.env ./.env

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/main"]