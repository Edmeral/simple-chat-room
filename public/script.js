var htmlEscapes = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#x27;',
	'/': '&#x2F;'
};

var escape = function(str) {
	return ('' + str).replace(htmlEscaper, function(match) {
		return htmlEscapes[match];
	});
};

var unescapeHTML = function(str) {
	return str.replace('&amp;', '&')
            .replace('&quot;', '"')
            .replace('&lt;', '<')
            .replace('&gt;', '>');
};

var htmlEscaper = /[&<>"'\/]/g;

var pseudo = escape(prompt('Choose a pseudo')) || 'Anonymous';

var socket = io.connect();

socket.emit('new-user', unescapeHTML(pseudo));

socket.on('new-user', function(pseudo) {
	$('#conversation').prepend('<div class="animated fadeInLeft"><p><em><strong>' + pseudo + '</strong>  has joined the chat.</em><p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

socket.on('message', function(data) {
	$('#conversation').prepend('<div class="animated fadeInLeft"><p class="name he">' + data.pseudo + '</p><p class="message he">' + data.message + '</p><hr></div>');
	//Add animation
	$('#conversation').addClass('animated fadeInDown');
	//and then remove it when animation ends
	$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
		$('#conversation').removeClass('animated fadeInDown');
	});
});

var input = $('input');
input.keyup(function(event) {
	if (event.which == 13) {
		if (input.val()) {
			socket.emit('message', input.val());
			$('#conversation').prepend('<div class="animated fadeInRight"><p class="name">' + pseudo + '</p><p class="message">' + escape(input.val()) + '</p><hr></div>');
			//Add animation
			$('#conversation').addClass('animated fadeInDown');
			//and then remove it when animation ends
			$('#conversation').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$('#conversation').removeClass('animated fadeInDown');
			});
			input.val('');
			input.attr('placeholder', 'Type your message...');
			input.focus();
		}
	}
});
