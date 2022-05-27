
FROM node:14

ARG BUILD_ENV=develop

WORKDIR /usr/src/app

COPY package*.json ./

RUN ["yarn", "install"]

COPY .env.$BUILD_ENV .env
COPY . .

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
