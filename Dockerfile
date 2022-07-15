# we'll use the latest node.js version.
FROM node:latest

# set our working directory first
WORKDIR /usr/minerva

# then, we need to install our dependencies
COPY package.json .
RUN npm install yarn
RUN yarn
COPY . .

# after that, build the app
RUN yarn build

# finally, start the app
CMD ["yarn", "start"]
