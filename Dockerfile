FROM node:argon

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Install app dependencies
COPY package.json /usr/src/api/
RUN npm install --production

COPY . /usr/src/api

EXPOSE 9000

CMD [ "npm", "start" ]
