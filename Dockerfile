FROM node:12

WORKDIR /usr/src/voting-system

COPY ./package.json .

RUN npm install --only=prod