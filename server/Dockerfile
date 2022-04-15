FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY .env.prod .env
RUN yarn build

ENV NODE_ENV production

CMD [ "yarn", "start" ]