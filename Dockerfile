FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

COPY .env.${BUILD_ENV} .env

RUN yarn install

COPY . .

RUN yarn build 

ENTRYPOINT [ "yarn", "start" ]
