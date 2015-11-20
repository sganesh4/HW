FROM ubuntu:14.04
#install required packages
RUN apt-get update;  apt-get -y upgrade;  apt-get install -y socat
RUN cd ~; echo "Welcome to this docker fileio demo" >> output.log; echo "The time this file was last written: `date`" >> output.log; echo "Thank you for watching this demo" >> output.log
#start socat
CMD socat TCP-LISTEN:9001,fork 'SYSTEM:cat ~/output.log'
EXPOSE 9001

