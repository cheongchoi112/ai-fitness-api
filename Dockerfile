# Use Node.js LTS version as the base image
FROM node:20-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose the port the app runs on and set environment flags
ENV PORT=8080
ENV RUNNING_IN_DOCKER=true
EXPOSE 8080

# Command to run the application
CMD ["node", "src/server.js"]
