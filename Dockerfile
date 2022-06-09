FROM node:14-slim

WORKDIR /usr/src/app

ADD package.json .
ADD okteto-stack.yml /okteto-stack.yml
RUN yarn

COPY src/index.ts .

EXPOSE 5001

CMD yarn dev
