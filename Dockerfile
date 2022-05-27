FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN ["yarn", "install"]

COPY .env.temp .env
COPY . .

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
