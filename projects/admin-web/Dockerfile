FROM node:18-buster as build

RUN apt update && apt install rsync -y

# ==============================
# build container
# ==============================

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

ARG BRAND
ENV NODE_ENV=development

WORKDIR /app/src

# Here we are building the dependencies first, so if package.json or yarn.lock didn't change
# the `yarn` step would be cached and deps wont need to be rebuilt
ARG NPM_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}\n@theunigroup:registry=https://npm.pkg.github.com" > .npmrc
COPY package*.json ./
RUN npm install

# Copy rest of application files into the build context
RUN echo "======== Begining copy the src files. ========"
COPY . .

RUN rm -fr .npmrc

# Build application static output
ENV NODE_ENV=production
RUN rsync -avz brand/$BRAND/ ./
RUN yarn build

RUN echo $BRAND

FROM node:18-buster as run

RUN apt-get update && apt-get install nginx nodejs -y

COPY --from=build /app/src/dist/ /app
COPY ./.deploy/generate-env-json /usr/local/bin/generate-env-json
COPY ./.deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD generate-env-json /app/env.json && \
    nginx -c /etc/nginx/nginx.conf