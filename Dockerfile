FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

COPY .env.testnet .env
COPY .sentryclirc .sentryclirc

RUN yarn install

COPY . .

RUN yarn build 

ENTRYPOINT [ "yarn", "start" ]
