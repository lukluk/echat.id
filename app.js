var express = require('express');
var app = express();
const uuid = require('uuid');
var request = require('request');
var redis = require('redis'),
    client = redis.createClient('6379','localhost');
var queue = []
var done = false
function addQueue(id,query) {
   query=query.replace('/wa','') 
   if(query=='/favicon.ico') return false
    var o = {}
    o.url = 'http://localhost:3100' + query
    o.cb = function(id,url,data) {
        client.set(id,'{ "url":"'+url+'","response":'+data+'}')
    }
    o.id=id
    queue.push(o)
    console.log('queue added', queue.length)
    if (queue.length == 1)
        thread()
}

function thread() {
done=false
    setTimeout(function(){
if(!done){
      console.log("TIMEOUT ")
      queue.splice(0, 1);
      thread()
 }
    },30000)
 console.log(queue)
   if(queue && queue[0])
    request(queue[0].url, function(error, response) {
        done=true
	console.log('done', queue[0].url)
        body = response ? response.body : ''
	console.log('got',body)
        queue[0].cb(queue[0].id,queue[0].url,body)
        queue.splice(0, 1);
        console.log('remaining queue', queue.length)
        if (queue.length > 0)
            thread()
    })
}
app.get('/json/:id',function(req,res){
console.log(req.params.id)
	client.get(req.params.id,function(err,data){
		console.log(err)
		res.send(data)
	})
})
app.get('/wa/*', function(req, res, next) {
  id = uuid.v1()
  addQueue(id,req.originalUrl)
  res.json({queueId:id,timestart:(new Date()).getTime()})
});
app.listen(8080);
