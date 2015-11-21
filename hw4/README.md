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

* Clone the deployment workshop repo and create a directory structure using the below commands
```
git clone https://github.com/CSC-DevOps/Deployment.git
cd Deployment
mkdir -p deploy/{green.git,blue.git,green-www,blue-www}
cd green.git; git init --bare
cd ../blue.git; git init --bare
```
* Update the 'post-receive' hook in blue.git/hooks and green.git/hooks with the contents of [blue-hook](https://raw.githubusercontent.com/sganesh4/HW/master/hw4/task3/blue-post-receive) and [green-hook](https://raw.githubusercontent.com/sganesh4/HW/master/hw4/task3/green-post-receive) respectively
* Update ~/.bash_profile with the following changes and restart all terminals
```
export ROOT=/root/test/Deployment/deploy
export APP_ROOT=/root/test/App/
```
* Clone the [simple node.js App](https://github.com/CSC-DevOps/App) repo and update the .git/hooks/pre-push with [this](https://raw.githubusercontent.com/sganesh4/HW/master/hw4/task3/app-pre-push) and execute the following commands.
```
git remote add green file://$ROOT/green.git
git remote add blue file://$ROOT/blue.git
```
* Start the docker registry using
```
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```
* Push changes to blue and green using and view the file changes at http://<server_ip>:9000 & http://<server_ip>:9001
```
git push green master
git push blue master
```

#### Screencast 
[![Alt text for your video](http://img.youtube.com/vi/KIVSGxPvmEk/0.jpg)](http://www.youtube.com/watch?v=KIVSGxPvmEk)
