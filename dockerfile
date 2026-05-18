FROM node:24-alpine

# Install compatibility package
RUN apk add --no-cache libc6-compat

# Working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Copy environment file
COPY .env .env

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
