FROM nginx:stable-alpine

ADD ./dist/ /usr/share/app

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80