FROM node:14

WORKDIR /home/node/api

COPY package*.json ./

RUN apt-get update; apt-get install -y curl
RUN apt-get install -y unoconv
RUN npm install --global nodemon

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
