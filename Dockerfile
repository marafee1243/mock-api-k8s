FROM node:18.20-alpine

WORKDIR /app

COPY index.js .
COPY package.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node", "/app/index.js" ]