# --- multistage docker build: stage #1: build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json package-lock.json ./

# Update npm
RUN npm install -g npm@10.8.1

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# --- multistage docker build: stage #2: runtime image
FROM node:alpine

WORKDIR /app

# CORS AND LISTENING
ENV PROTOCOL="HTTP"
ENV PORT="8000"
ENV ORIGINS="localhost:8000"

# MONGODB URI
ENV ATLAS_URI="mongodb://admin:password@mongodb:27017/htn-translation-layer?authSource=admin"

# Certificate and key for https
ENV HTTPS_CERT="/etc/letsencrypt/live/hoosat.fi/cert.pem"
ENV HTTPS_KEY="/etc/letsencrypt/live/hoosat.fi/privkey.pem"
ENV HTTPS_CA="/etc/letsencrypt/live/hoosat.fi/chain.pem"

# Mail Configuration with SMTP
ENV EMAIL_SERVER_TYPE="service"
ENV EMAIL_SERVICE="gmail"
ENV EMAIL_USERNAME=""
ENV EMAIL_PASSWORD=""

# Copy only the build output from the previous stage
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY package.json /app/package.json

# Expose port 8000
EXPOSE 8000

# Command to run explorer
CMD ["npm", "run", "start"]