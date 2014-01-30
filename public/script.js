var pseudo = prompt('Choose a pseudo') || 'Anonymous';
var htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2F;'
};
var escape = function(string) {
	return ('' + string).replace(htmlEscaper, function(match) {
		return htmlEscapes[match];
	});
};
var htmlEscaper = /[&<>"'\/]/g;
var socket = io.connect('http://simple-chat-room.herokuapp.com');


socket.emit('new-user', pseudo);

socket.on('new-user', function(pseudo) {
	$('#conversation').prepend('<p><em><strong>' + pseudo + '</strong>  has joined the chat.</em><p><hr>');
});
socket.on('message', function(data) {
	$('#conversation').prepend('<p class="name he">' + data.pseudo + '</p><p class="message he">' + data.message + '</p><hr>');
});

var input = $('input');
input.keyup(function(event) {
	if (event.which == 13) {
		if (input.val()) {
			socket.emit('message', input.val());
			$('#conversation').prepend('<p class="name">' + pseudo + '</p><p class="message">' + escape(input.val()) + '</p><hr>');
			input.val('');
			input.attr('placeholder', 'Type your message...');
			input.focus();
		}
	}
});