FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
