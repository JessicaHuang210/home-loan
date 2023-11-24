FROM node:20.4.0
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn build
COPY . .
EXPOSE 3000
CMD [ "yarn", "start" ]