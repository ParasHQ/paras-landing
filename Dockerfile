FROM node:16.18.0-alpine3.15 AS deps

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16.18.0-alpine3.15 AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY .env.temp .env
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build

FROM node:16.18.0-alpine3.15 AS runner

WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules

ENTRYPOINT ["node_modules/.bin/next", "start"]