var express = require('express');
var app = express();
var Nightmare = require('nightmare');
var realMouse = require('nightmare-real-mouse');

// add the plugin
realMouse(Nightmare);

require('nightmare-upload')(Nightmare);
var nightmare = Nightmare({
    show: true
})
nightmare
    .goto('https://web.whatsapp.com/')
    .inject('js', 'sendkey.js')
    .then(function(title) {
        //console.log(title);
    })


function checkSession(cb) {
    nightmare
        .evaluate(function() {
            if (jQuery('.btn-default').length > 0) {
                jQuery('.btn-default').click()
            }
        })
        .wait('.pane-list')
        .then(function() {
            cb()
        })
}


function scroll(cb, el, child, mode, max, n, now) {
    console.log('scroll', el, child, mode, max, n, now)
    nightmare
        .evaluate(function(elem, mode, echild, n) {
            var ch = jQuery(elem).find(echild).length
            if (!n) {
                jQuery(elem).scrollTop(jQuery(elem)[0].scrollHeight)
            }
            if (mode == 'top')
                jQuery(elem).scrollTop(((jQuery(elem)[0].scrollHeight) / 100) * (n * 10))
            if (mode == 'down')
                jQuery(elem).scrollTop(0)
            jQuery('title').html(elem + '->' + echild + '->' + ch)
            return ch
        }, el, mode, child, n)
        .then(function(ch) {
            setTimeout(function() {
                console.log('child', ch)
                console.log('max<=n', max, n)
                console.log('!now', now)
                console.log('ch > now', ch, now)
                n = n ? n : 0
                if (max <= n) {
                    cb()
                } else
                if (!now) {
                    n++
                    scroll(cb, el, child, mode, max, n, ch)
                } else
                if (ch > now) {
                    n++
                    scroll(cb, el, child, mode, max, n, ch)
                } else {
                    n++
                    scroll(cb, el, child, mode, max, n, ch)
                }
            }, 2500)

        })
}

function readChatHistory(user, max, cb) {
    if (user.indexOf('62 ') > -1) {
        user = '+' + user.trim()
        console.log('fetch ', user)
    }
    nightmare
        .evaluate(function(user) {
            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.split(search).join(replacement);
            }
            jQuery('.input-search').sendkeys(user.replaceAll('-', '').replaceAll('+62 ', ''))
        }, user)
        .wait(function(user){
          return true
        },user)
        .realClick(".chat-title .emojitext[title='" + user + "']")
        .wait('.pane-chat-tile')
        .wait(500)
        .then(function() {
            scroll(function() {
                nightmare
                    .evaluate(function() {
                        var data = {}
                        jQuery('.message-system').remove()

                        function removeBetwen(str) {

                            var cpos = str.indexOf("["),
                                spos = str.indexOf("]");
                            if (cpos > -1 && spos > cpos)
                                return (str.substr(0, cpos) + str.substr(spos + 1)).trim().replace(':', '').trim();

                        }

                        function getBetwen(str) {
                            return str.substring(str.lastIndexOf("[") + 1, str.lastIndexOf("]"));
                        }
                        var cuser = ''
                        var cindex = 0;
                        jQuery('.msg').each(function(i, e) {
                            var o = {}
                            if (jQuery(this).find('.message-out').length > 0)
                                o.user = 'you'
                            else
                                o.user = removeBetwen(jQuery(this).find('.message-pre-text').text())
                            o.date = getBetwen(jQuery(this).find('.message-pre-text').text())

                            o.msg = jQuery(this).find('.selectable-text').text()
                            if (cuser == o.user) {
                                cindex++
                            } else {
                                cindex = 0
                            }
                            cuser = o.user
                            var dt = parseInt(Date.parse(o.date)) + cindex

                            o.id = md5(o.msg + dt)
                            if (o.msg != '')
                                data[dt + o.id] = o
                        })
                        var x = jQuery('.input-search').val().length
                        for (var i = 0; i < x; i++) {

                            jQuery('.input-search').sendkeys('{Backspace}')

                        }

                        return data
                    })
                    .then(function(data) {

                        cb(false, data)
                    })
                    .catch(function(error) {
                        cb(true, error)
                    })
            }, '.pane-chat-msgs', '.msg', 'down', max)
        })
        .catch(function(error) {
            console.log(error)
        })


}

app.get('/login', function(req, res) {
    nightmare
        .wait('.qrcode')
        .evaluate(function() {
            return jQuery('.qrcode img').attr('src')
        })
        .then(function(data) {
            res.send('<img src="' + data + '">');
        })

})

function readChatsHistory(users, cb, chats, i) {
    i = i ? i : 0
        //console.log('readChatsHistory',users,cb,chats,i)
    chats = chats ? chats : {}
    if (users.length <= i) {
        cb(false, chats)
    } else
        readChatHistory(users[i], 1, function(err, data) {
            if (err) {
                cb(true, data)
            } else {
                chats[users[i]] = data
                i++
                readChatsHistory(users, cb, chats, i)
            }
        })
}

app.get('/unread', function(req, res) {
    nightmare
        .evaluate(function() {
            var unread = []
            jQuery('.unread').each(function() {
                jQuery(this).removeClass('unread')
                unread.push(jQuery(this).find('.chat-title').text().trim())
            })
            return unread
        })
        .then(function(users) {
            //console.log('users',users)
            readChatsHistory(users, function(err, data) {
                if (err) {
                    res.json({
                        error: true,
                        message: data
                    })
                } else {
                    res.json(data)
                }
            })
        })
})
app.get('/chat', function(req, res) {
  console.log('chat')
    checkSession(function() {
        readChatHistory(req.query.user, 10, function(err, data) {
            if (err) {
                res.json({
                    error: true,
                    message: data
                })
            } else {
                res.json(data)
            }
        })
    })
})

app.get('/list', function(req, res) {
    checkSession(function() {
        scroll(function() {
            nightmare
                .evaluate(function() {
                    var data = {}
                    jQuery('.infinite-list-item').each(function() {
                        var o = {}
                        if (jQuery(this).find('.unread').length > 0) {
                            o.unread = true
                        }
                        o.title = jQuery(this).find('.chat-title span').attr('title')
                        o.avatar = jQuery(this).find('.chat-avatar img').attr('src')
                        data[o.title] = o
                    })
                    return data
                })
                .then(function(data) {
                    res.json(data)
                })
                .catch(function(error) {
                    res.json({
                        error: true,
                        message: error
                    })
                })
        }, '#pane-side', '.infinite-list-item', 'top', 10)
    })
})

app.get('/sendmsg', function(req, res) {
    checkSession(function() {
        nightmare
            .evaluate(function(user) {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                }
                jQuery('.input-search').sendkeys(user.replaceAll('-', '').replaceAll('+62', ''))
            }, req.query.user)
            .wait('.emojitext[title=' + req.query.user + ']')
            .realClick('.emojitext[title=' + req.query.user + ']')
            .wait('.pane-chat-tile')
            .evaluate(function(msg) {
                jQuery('[contenteditable]').sendkeys(msg)
            }, req.query.msg)
            .wait('.icon-send')
            .realClick('.icon-send')
            .realClick('.icon-search-morph')
            .evaluate(function() {
                var data = {}
                jQuery('.message-system').remove()

                function removeBetwen(str) {

                    var cpos = str.indexOf("["),
                        spos = str.indexOf("]");
                    if (cpos > -1 && spos > cpos)
                        return (str.substr(0, cpos) + str.substr(spos + 1)).trim().replace(':', '').trim();

                }
                var cuser = ''
                var cindex = 0;

                function getBetwen(str) {
                    return str.substring(str.lastIndexOf("[") + 1, str.lastIndexOf("]"));
                }

                jQuery('.msg').each(function(i, e) {
                    var o = {}
                    if (jQuery(this).find('.message-out').length > 0)
                        o.user = 'you'
                    else
                        o.user = removeBetwen(jQuery(this).find('.message-pre-text').text())
                    o.date = getBetwen(jQuery(this).find('.message-pre-text').text())

                    o.msg = jQuery(this).find('.selectable-text').text()
                    if (cuser == o.user) {
                        cindex++
                    } else {
                        cindex = 0
                    }
                    cuser = o.user
                    var dt = parseInt(Date.parse(o.date)) + cindex

                    o.id = md5(o.msg + dt)
                    if (o.msg != '')
                        data[dt + o.id] = o
                })
                var x = jQuery('.input-search').val().length
                for (var i = 0; i < x; i++) {

                    jQuery('.input-search').sendkeys('{Backspace}')
                }
                return data
            })
            .then(function(data) {
                res.json(data)
            })
            .catch(function(error) {
                console.log(error)
                res.json({
                    error: true,
                    message: error
                })
            })
    })
})
app.listen(3000);
