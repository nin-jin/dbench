# BUILD: docker build -t dbench:dbench ./
# RUN: docker run -t -d -i --link db:db dbench:dbench
FROM ubuntu
MAINTAINER jin <nin-jin@ya.ru>

# install linux soft
RUN apt-get -qq -y update
RUN apt-get -qq -y upgrade
RUN apt-get -qq -y install wget xz-utils --fix-missing
RUN wget https://iojs.org/dist/v3.3.1/iojs-v3.3.1-linux-x64.tar.xz
RUN tar xf iojs-v3.3.1-linux-x64.tar.xz
RUN cd iojs-v3.3.1-linux-x64
RUN mv -n bin/* /usr/bin
RUN cd ..
RUN rm -rf iojs-v3.3.1-linux-x64

# build application
ADD ./package.json /dbench/
RUN cd /dbench/
RUN npm install
ADD . /dbench/
WORKDIR /dbench/

ENTRYPOINT [ "npm" , "start" ]
