FROM node:20-alpine

WORKDIR /app

# copy package.json first to leverage Docker cache
COPY package*.json ./

RUN npm install

# copy all files including .env
COPY . . 
COPY .env .env

# build TypeScript
RUN npm run build

# run seeds and then start app
CMD ["sh", "-c", "node dist/seeds/seed.js && npm run start:dev"]
