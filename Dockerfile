# FROM node:20-alpine
FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY . .
# RUN npm config set strict-ssl false
RUN npm ci

EXPOSE 5000

CMD [ "node", "index.js" ]
