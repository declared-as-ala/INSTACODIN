# 1. استخدم Node Alpine صغير وخفيف
FROM node:20-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build


CMD ["sh", "-c", "node dist/seeds/seed.js && npm run start:dev"]
