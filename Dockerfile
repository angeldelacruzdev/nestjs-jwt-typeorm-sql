FROM node:19-alpine

WORKDIR /app

COPY . .


RUN npm i -g @nestjs/cli

RUN npm ci --omit=dev

RUN npm install -D ts-loader

RUN  npm run build

USER node

CMD ["npm", "run", "start:prod"]