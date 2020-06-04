FROM node:12

WORKDIR /app

RUN apt-get update

COPY package*.json ./
RUN npm ci
ADD . /app
RUN npm run build

CMD ["npm", "start"]
EXPOSE 4000
