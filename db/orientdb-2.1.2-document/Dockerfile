# BUILD: docker build -t dbench:orientdb ./
# RUN: docker run -t -d -i dbench:orientdb
FROM ubuntu
MAINTAINER jin <nin-jin@ya.ru>
RUN apt-get -qq update
RUN apt-get -y install default-jre-headless
ADD . /orientdb/
RUN chmod +x /orientdb/bin/server.sh
RUN chmod +x /orientdb/bin/console.sh
WORKDIR /orientdb
ENTRYPOINT [ "./bin/server.sh" ]
#ENTRYPOINT [ "/orientdb/bin/server.sh" , "-Ddistributed=true" ]
EXPOSE 2424
EXPOSE 2480