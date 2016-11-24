var express = require('express');
var app = express();
var Nightmare = require('nightmare');
var realMouse = require('nightmare-real-mouse');
realMouse(Nightmare);
require('nightmare-upload')(Nightmare);

var nightmare = Nightmare({
	show: false
})
nightmare
	.goto('https://web.whatsapp.com/')
	.inject('js', 'sendkey.js')
	.then(function(title) {
		//console.log(title);
	})
var Nav = require('./nav');
var nav = new Nav(nightmare)

app.get('/login', function(req, res) {
	nightmare
		.wait('.qrcode')
    .screenshot('token.png')
		.evaluate(function() {
			return jQuery('.qrcode img').attr('src')
		})
		.then(function(data) {
			res.send('<img src="' + data + '">');
		})

})
app.all('/*', function(req, res, next) {
  if(req.originalUrl=='/login' || req.originalUrl=='/'){
    next()
  }else
	nav.checkSession(function() {
		next()
	})
});
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
			nav.readChatsHistory(users, function(err, data) {
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
	nav.readChatHistory(req.query.user, 10, function(err, data) {
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

app.get('/list', function(req, res) {

	nav.scroll(function() {
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

app.get('/open', function(req, res) {
	nav.openWindow(req.query.user, function(err) {
		if (err) {
			res.JSON({
				error: true
			})
		}
		res.json({
			success: true
		})
	})
})

app.get('/sendmsg', function(req, res) {
	nav.openWindow(req.query.user, function(err) {
    nightmare
		.evaluate(function(msg) {
				jQuery('[contenteditable]').sendkeys(msg)
			}, req.query.msg)
			.wait('.icon-send')
			.realClick('.icon-send')
			.realClick('.icon-search-morph')
      .screenshot('./screenshot/'+'click-icon-'+req.query.user+'.png')
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
				res.json({success:true,log:data})
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
