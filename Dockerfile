
FROM node:14

ARG BUILD_ENV=develop

WORKDIR /usr/src/app
COPY package*.json ./

COPY .env.$BUILD_ENV .env

RUN ["yarn", "install"]

COPY . .

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
