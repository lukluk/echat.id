var express = require('express');
var app = express();
const uuid = require('uuid');
var request = require('request');
var redis = require('redis'),
    client = redis.createClient('6379','localhost');
var queue = []
function addQueue(id,query) {
<<<<<<< HEAD
=======
    if(query=='/favicon.ico') return false
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
    var o = {}
    o.url = 'http://localhost:3000' + query
    o.cb = function(id,url,data) {
        client.set(id,data)
    }
    o.id=id
<<<<<<< HEAD
=======
    console.log(query+' added')
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
    queue.push(o)
    console.log('queue added', queue.length)
    if (queue.length == 1)
        thread()
}

function thread() {
    console.log('call', queue[0].url)
<<<<<<< HEAD
    setTimeout(function(){
      console.log("TIMEOUT ")
      queue.splice(0, 1);
      thread()
    },10000)
=======
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
    request(queue[0].url, function(error, response) {
        console.log('done', queue[0].url)
        body = response ? response.body : ''
        queue[0].cb(queue[0].id,queue[0].url,body)
        queue.splice(0, 1);
        console.log('remaining queue', queue.length)
        if (queue.length > 0)
            thread()
    })
}
app.get('/*', function(req, res, next) {
  id = uuid.v1()
  addQueue(id,req.originalUrl)
  res.json({queueId:id,timestart:(new Date()).getTime()})
});
<<<<<<< HEAD
app.listen(8080);
=======
app.listen(80);
>>>>>>> f93d1bf953d4d9e4b64ea77b70c4d6d5c2d727d4
