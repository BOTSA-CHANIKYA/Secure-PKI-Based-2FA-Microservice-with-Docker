# Dockerfile
FROM node:22-alpine

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY src ./src
COPY Keys ./Keys

# Copy env file at build time only if you want defaults (better to use real env vars at run time)
# COPY .env ./

EXPOSE 8081

CMD ["node", "src/app-gateway.js"]
