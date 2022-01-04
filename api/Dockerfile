FROM node:alpine3.12
ENV NODE_ENV=production
ENV ENV=prod

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]
