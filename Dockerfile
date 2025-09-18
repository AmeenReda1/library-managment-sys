# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Remove development dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
