FROM node:22 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

ARG BUILD
RUN npm run build -- --mode $BUILD
