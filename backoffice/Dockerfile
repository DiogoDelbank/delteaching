FROM node:20 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM nginx:1.15

COPY --from=build-stage /app/.next /usr/share/nginx/html
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
