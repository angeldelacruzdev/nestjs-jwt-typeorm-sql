FROM node:19-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i -g @nestjs/cli

RUN npm ci --omit=dev

RUN npm install -D ts-loader

COPY . .

RUN  npm run build

USER node

CMD ["npm", "run", "start:prod"]