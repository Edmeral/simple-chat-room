var express = require('express');
var ent = require('ent');


var app = express();
var server = require('http').createServer(app);

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/public'))
	.get('/', function(req, res) {
		res.sendfile(__dirname + '/public/index.html');
	});

var io = require('socket.io').listen(server);
io.enable('browser client minification');
io.enable('browser client gzip');

io.sockets.on('connection', function(socket) {
	socket.on('new-user', function(pseudo) {
		socket.set('pseudo', pseudo);
		socket.broadcast.emit('new-user', ent.encode(pseudo));
	});
	socket.on('message', function(message) {
		socket.get('pseudo', function(error, pseudo) {
			if (error) {
				console.log(error);
			} 
			else {
				socket.broadcast.emit('message', {
					pseudo: ent.encode(pseudo),
					message: ent.encode(message)
				});
			}
		});
	});
});