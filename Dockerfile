# BUILD: docker build -t dbench:dbench ./
# RUN: docker run -t -d -i --link db:db dbench:dbench
FROM ubuntu
MAINTAINER jin <nin-jin@ya.ru>

# install linux soft
RUN apt-get -qq -y update
RUN apt-get -qq -y upgrade
RUN apt-get -qq -y install software-properties-common --fix-missing
RUN add-apt-repository ppa:dhor/myway
RUN apt-get -qq -y install nodejs npm libkrb5-dev --fix-missing
RUN link /usr/bin/nodejs /usr/bin/node

# build application
ADD ./package.json /dbench/
RUN cd /dbench/
RUN npm install
ADD ./* /dbench/
WORKDIR /dbench/

ENTRYPOINT [ "npm" , "start" ]
