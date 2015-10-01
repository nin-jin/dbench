# BUILD: docker build -t dbench:dbench ./
# RUN: docker run -t -d -i --link db:db dbench:dbench
FROM ubuntu
MAINTAINER jin <nin-jin@ya.ru>

# install linux soft
RUN apt-get -qq -y update
RUN apt-get -qq -y upgrade
RUN apt-get -qq -y install software-properties-common --fix-missing
RUN add-apt-repository ppa:dhor/myway
RUN apt-get -qq -y install nodejs npm --fix-missing
RUN link /usr/bin/nodejs /usr/bin/node

# build application
ADD . /dbench/
WORKDIR /dbench/

RUN npm install

ENTRYPOINT [ "npm" , "start" ]
