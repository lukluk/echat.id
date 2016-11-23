function Nav(nightmare) {
	this.checkSession = function (cb) {
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

	this.openWindow = function (user, cb) {
		nightmare
			.insert('.input-search', user)
			.wait(1000)
			.evaluate(function(user) {
				var debuglog = []
				jQuery('.emojitext').each(function() {
					debuglog.push(jQuery(this).attr('title'))
					jQuery(this).attr('title', (jQuery(this).attr('title') + '').replaceAll(' ', '').replaceAll('-', '').replace('+', ''))

				})
				if (jQuery('.emojitext[title=' + user + ']').length > 0) {
					jQuery('.emojitext[title=' + user + ']').attr("class", 'el' + user)
				}
				debuglog.push($('<div>').append(jQuery('.el' + user).clone()).html())
				return {
					isfound: jQuery('.el' + user).length > 0,
					all: jQuery('.el' + user),
					debug: debuglog
				}
			}, user)
			.then(function(obj) {
				console.log(obj)
				if (obj.isfound) {
					console.log('.el' + user)
					nightmare
						.realClick('.emojitext')
						.wait('.pane-chat-tile')
						.wait(500)
						.screenshot('./screenshot/'+user + 'opened2.png')
						.then(function() {
							cb && cb(false)
						})

				} else {
					cb && cb(true)
				}
			})
	}

	this.scroll = function (cb, el, child, mode, max, n, now) {
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

	this.readChatHistory = function (user, max, cb) {
		if (user.indexOf('62 ') > -1) {
			user = '+' + user.trim()
			console.log('fetch ', user)
		}
		nightmare
			.evaluate(function(user) {
				jQuery('.input-search').sendkeys(user.replaceAll('-', '').replaceAll('+62 ', ''))
			}, user)
			.wait(function(user) {
				return true
			}, user)
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

	this.readChatsHistory = function (users, cb, chats, i) {
		i = i ? i : 0
    var self = this
			//console.log('readChatsHistory',users,cb,chats,i)
		chats = chats ? chats : {}
		if (users.length <= i) {
			cb(false, chats)
		} else
			self.readChatHistory(users[i], 1, function(err, data) {
				if (err) {
					cb(true, data)
				} else {
					chats[users[i]] = data
					i++
					self.readChatsHistory(users, cb, chats, i)
				}
			})
	}
}
module.exports = Nav
