FROM node:16

ENV NODE_PORT 3000
ENV DOCKERIZE_VERSION v0.6.1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y wget

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY ./app/package*.json .

RUN npm install

COPY ./app .

EXPOSE $NODE_PORT
