var socket = io();
socket.on('update:contact', function(contacts) {
    var source   = $("#contacts-tpl").html();
    var template = Handlebars.compile(source);
    jQuery('#contacts').html(template({contacts:contacts}))
    jQuery('ul.contact li').click(function(){
      socket.emit('get:chat',jQuery(this).attr('data-chat'))
    })
});
socket.on('new:message', function(msg) {
    console.log(msg)
});
socket.on('update:chat', function(chat) {
  var msg =[]
  for(var c in  chat){
    msg.push(chat[c])
    console.log(chat[c].msg)
  }
  var source   = $("#messages-list-tpl").html();
  var template = Handlebars.compile(source);
  jQuery('#messages-list').html(template({messages:msg}))
});
