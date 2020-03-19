FROM alpine

RUN apk update
RUN apk add git
RUN apk add nodejs
RUN apk add npm
