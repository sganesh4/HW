# Homework 4 - Advanced Docker

In this homework assignment, you'll get to practice several common architectural patterns for dealing with multiple docker containers.
* Clone the repository using 
```
git clone https://github.com/sganesh4/HW.git
```
1) **File IO**: You want to create a container for a legacy application. You succeed, but you need access to a file that the legacy app creates.
* Create and run the fileio container using the below commands
```
cd HW/hw4/task1/file_container
docker build -t file .
docker run -d --name fileio file
```

* Create and run the request container using the below commands
```
cd HW/hw4/task1/request_container/
docker build -t request .
docker run -it --link fileio:client request -c 'exec curl http://"$CLIENT_PORT_9001_TCP_ADDR":"$CLIENT_PORT_9001_TCP_PORT"'
```

2) **Ambassador pattern**: Implement the remote ambassador pattern to encapsulate access to a redis container by a container on a different host.

* For this demonstration I am using 2 DO droplets
* On the server droplet run the following commands
```
cd HW/hw4/task2/server_compose
docker-compose up -d
docker ps
docker exec -it <container_id for redis_server> redis-cli
```

* On the client droplet run the commands shown below
```
cd HW/hw4/task2/client_compose/
docker-compose run --rm redis_client
```
* Set and Get flags across servers to verify functionality

3) **Docker Deploy**: Extend the deployment workshop to run a docker deployment process.

* A commit will build a new docker image.
* Push to local registery.
* Deploy the dockerized [simple node.js App](https://github.com/CSC-DevOps/App) to blue or green slice.
* Add appropriate hook commands to pull from registery, stop, and restart containers.
