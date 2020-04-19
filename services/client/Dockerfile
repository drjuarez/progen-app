FROM node:10 as build-stage


# Puppeteer dependencies, from: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && apt-get update \
    && apt-get install -y fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

WORKDIR /app

COPY nginx.conf /nginx.conf

COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf


## set the base image
## n/b: for production, node is only used for building
## the static Html and javascript files
## as react creates static html and js files after build
## these are what will be served by nginx
## use alias build to be easier to refer this container elsewhere
## e.g inside nginx container
#FROM node:alpine as build
## set working directory
## this is the working folder in the container
## from which the app will be running from
#WORKDIR /app
## copy everything to /app directory
## as opposed to on dev, in prod everything is copied to docker
#COPY . /app
## add the node_modules folder to $PATH
#ENV PATH /app/node_modules/.bin:$PATH
## install and cache dependencies
#RUN yarn
##build the project for production
#RUN yarn build
## set up production environment
## the base image for this is an alpine based nginx image
#FROM nginx:alpine
## copy the build folder from react to the root of nginx (www)
#COPY --from=build /app/build /usr/share/nginx/html
## --------- only for those using react router ----------
## if you are using react router
## you need to overwrite the default nginx configurations
## remove default nginx configuration file
#RUN rm /etc/nginx/conf.d/default.conf
## replace with custom one
#COPY depnginx.conf /etc/nginx/conf.d
## --------- /only for those using react router ----------
## expose port 80 to the outer world
#EXPOSE 80
## start nginx
#CMD ["nginx", "-g", "daemon off;"]