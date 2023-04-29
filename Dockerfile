FROM node:18-alpine

WORKDIR /src/app

COPY . .

RUN npm i -g @nestjs/cli

RUN npm ci --omit=dev

RUN  npm run build

USER node

CMD ["npm", "run", "start:prod"]