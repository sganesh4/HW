var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var hProxy = require('http-proxy')
var http = require('http')
client.flushall()

var proxy = hProxy.createProxyServer({})
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
  console.log(req.method, req.url);

  client.lpush('recents', req.url, function(err,reply) {
    //console.log(reply);
    })

  next(); // Passing the request to the next handler in the stack.
});

app.get('/set', function(req, res) {
  res.send('Configuring expiring cache!!')
  client.set('expiring', 'this message will self-destruct in 10 seconds')
  client.expire('expiring', 10)
})

app.get('/get', function(req, res) {
  client.get('expiring', function(err,value){
    if(value){
      console.log(value)
      res.send(value)
    }
    else{
      console.log('The key you requested has expired')
      res.send('Key Expired')
    }
  })
})
app.get('/recents', function(req, res) {
  client.lrange('recents', 0,  4, function(err,value){
    if(value){
      console.log(value)
      res.send(value)
    }
    else{
      res.send('Error in recents')
    }
  })
})
app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
     fs.readFile( req.files.image.path, function (err, data) {
        if (err) throw err;
        var img = new Buffer(data).toString('base64');
        client.rpush(['images',img], function(err,resp) {
          console.log("Response : ",resp);
        })
    });
  }

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
  {
    client.rpop('images', function(err,data){
      if(data){
        res.writeHead(200, {'content-type':'text/html'});
        res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+data+"'/>");
        res.end();
      }
      else{
        res.send('Error in images')
      }
  })
  }
})

var proxyManager  = http.createServer(function(req, res) {
  client.lpop('proxy-servers', function(err, resp){
  if(!err) {
  console.log("Redirecting request to "+resp);
  proxy.web(req, res, { target: resp });
  client.rpush('proxy-servers', resp);
  }
})})
proxyManager.listen(80)

// HTTP SERVER
 var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   var url = 'http://'+host+':'+port
   client.rpush('proxy-servers', url)
   console.log('Example app listening at http://%s:%s', host, port)
 })

var server2 = app.listen(3001, function () {

   var host = server2.address().address
   var port = server2.address().port
   var url = 'http://'+host+':'+port
   client.rpush('proxy-servers', url)
   console.log('Example app listening at http://%s:%s', host, port)
 })
var server3 = app.listen(3002, function () {

   var host = server3.address().address
   var port = server3.address().port
   var url = 'http://'+host+':'+port
   client.rpush('proxy-servers', url)
   console.log('Example app listening at url http://%s:%s', host, port)
 })



process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    client.flushall()
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGHUP', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
