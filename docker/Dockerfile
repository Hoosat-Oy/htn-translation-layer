# --- multistage docker build: stage #1: build stage
FROM node:14-alpine AS build

# Set working directory
WORKDIR /app

# CORS AND LISTENING
ENV PROTOCOL="HTTP"
ENV PORT="8000"
ENV ORIGINS="localhost:8000"

# MONGODB URI
ENV ATLAS_URI=""

# Certificate and key for https
ENV HTTPS_CERT="/etc/letsencrypt/live/domain/cert.pem"
ENV HTTPS_KEY="/etc/letsencrypt/live/domain/privkey.pem"
ENV HTTPS_CA="/etc/letsencrypt/live/domain/chain.pem"

# Mail Configuration with SMTP
ENV EMAIL_SERVER_TYPE="service"
ENV EMAIL_SERVICE=""
ENV EMAIL_USERNAME=""
ENV EMAIL_PASSWORD=""


# Copy package.json and package-lock.json to work directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# --- multistage docker build: stage #2: runtime image
FROM node:alpine

WORKDIR /app

# Copy only the build output from the previous stage
COPY --from=build /app/build /app/build

# Expose port 8000
EXPOSE 8000

# Command to run explorer
CMD ["npm", "run", "start"]
