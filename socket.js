var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var request = require('request');
var redis = require('redis'),
    client = redis.createClient('32768','localhost');



var queue = []

function redisSet(key, obj) {
    client.set(key, JSON.stringify(obj), function(err, val) {
        if (err) console.log(err)
    })
}

function redisGet(key, cb) {
    client.get(key, function(err, val) {
        try {
            cb && cb(err, JSON.parse(val))
        } catch (err) {
            cb && cb(err, val)
        }
    })
}

function cronNewChat() {
    setTimeout(function() {
        console.log('unread')
        addQueue('unread', function(response) {
            var data = JSON.parse(response)
            if (Object.keys(data).length > 0) {
                redisGet('contact', function(err, contacts) {
                    contacts = contacts ? contacts : []
                    var unreadchat = []
                    for (var contact in data) {
                        if (contacts.indexOf(contact) > -1) {
                            unreadchat.push(contact)
                        }
                        var lastmsg = data[contact][Object.keys(data[contact])[Object.keys(data[contact]).length - 1]]
                        io.emit('new:message', {
                            from: contact,
                            msg: lastmsg.msg
                        })
                        redisGet('chat.' + contact, function(err, chat) {
                            chat = chat ? chat : {}
                            for (var msgId in data[contact]) {
                                if (!chat[msgId]) {
                                    console.log(msgId)
                                    chat[msgId] = data[contact][msgId]
                                }
                            }
                            redisSet('chat.' + contact, chat)
                        })
                    }

                    if (contacts.length == 0) {
                        contacts = unreadchat
                    } else {
                        var contacts = unreadchat.concat(contacts.filter(function(item) {
                            return unreadchat.indexOf(item) < 0;
                        }))
                    }

                    redisSet('contact', contacts)
                    io.emit('update:contact', contacts)
                    cronNewChat()
                })
            } else {
                cronNewChat()
            }
        })
    }, 10000)
}

function doCronNewContact() {
    addQueue('list', function(response) {
        var data = JSON.parse(response)
        console.log('data==>',Object.keys(data).length)
        redisGet('contact', function(err, contacts) {
            contacts = contacts ? contacts : []
            console.log('redis data==>',contacts.length)

            var newContact = []
            for (var contact in data) {
                if (contacts.indexOf(contact) < 0) {
                    newContact.push(contact)
                }
                redisSet('contact.' + contact, data[contact])
            }

            var allcontacts = newContact.concat(contacts.filter(function(item) {
                return newContact.indexOf(item) < 0;
            }))
            redisSet('contact', allcontacts)
            io.emit('update:contact', allcontacts)
            cronNewContact()
        })
    })
}

function cronNewContact() {
    setTimeout(function() {
        console.log('new contact')
        doCronNewContact()
    }, 300000)

}
doCronNewContact()
cronNewContact()
//cronNewChat()

function addQueue(query, cb) {
    var o = {}
    o.url = 'http://localhost:3000/' + query
    o.cb = function(data) {
        cb(data)
    }
    queue.push(o)
    console.log('queue added', queue.length)
    if (queue.length == 1)
        thread()
}

function thread() {
    console.log('call', queue[0].url)
    request(queue[0].url, function(error, response) {
        console.log('call response', queue[0].url)
        queue[0].cb(response.body)
        queue.splice(0, 1);
        console.log('remaining queue', queue.length)
        if (queue.length > 0)
            thread()
    })
}




app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('get:contacts', function() {
        doCronNewContact()
    })
    socket.on('get:chat', function(data) {
        redisGet('chat.' + data, function(err, history) {
            if (!history) {
                addQueue('chat?user=' + data, function(response) {
                    var chats = JSON.parse(response)
                    console.log(chats)
                    socket.emit('update:chat', chats)
                    redisSet('chat.' + data, chats)
                })
            } else
                socket.emit('update:chat', history)
        })
    });
    socket.on('send:message', function(data) {
        addQueue('sendmsg?user=' + data.to + '&msg=' + data.msg, function(response) {
            var newChat = JSON.parse(response)
            redisGet('chat.' + data.to, function(err, chats) {
                chats = chats ? chats : {}
                for (var msgId in newChat) {
                    if (!chats[msgId]) {
                        chats[msgId] = newChat
                    }
                }
                redisSet('chat.' + data.to, chats)
            })
        })
    });
    redisGet('contact', function(err, val) {
        socket.emit('update:contact', val)
    })
});

client.on('error', function(err) {
    console.log('Error ' + err);
});


http.listen(4040, function() {
    console.log('listening on *:4040');
});
