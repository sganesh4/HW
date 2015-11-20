FROM ubuntu:14.04
#install required packages
RUN apt-get update;  apt-get -y upgrade;  apt-get install -y build-essential; apt-get install -y wget
#install redis
RUN cd /tmp; wget http://download.redis.io/redis-stable.tar.gz; tar -zxvf redis-stable.tar.gz; cd redis-stable; make; make install 

#start redis
CMD ["redis-server"]
EXPOSE 6379
