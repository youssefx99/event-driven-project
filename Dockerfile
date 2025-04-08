# Use official Node.js base image
FROM node:18

# Create app directory inside container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Default command when container starts
CMD ["node", "index.js"]
