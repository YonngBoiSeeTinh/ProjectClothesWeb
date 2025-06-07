## Build stage
FROM node:20
WORKDIR /app
COPY package*.json .

## Install bun
FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install

## Run stage
COPY . .
EXPOSE 5173
CMD [ "bun","run","dev" ]