var express = require('express');
var easymongo = require('easymongo');
var ent = require('ent');

//Setting up MongoDB
var mongo = new easymongo(process.env.MONGOLAB_URL || 'mongodb://localhost/amando');
var posts = mongo.collection('posts');

//Setting up express
var app = express();
var server = require('http').createServer(app);

//Using bzip compression
app.use(express.compress());

server.listen(process.env.PORT || 8080);


app.use(express.static(__dirname + '/public'))

	.get('/', function(req, res) {
		posts.find(function(error, results) {
			res.render('index.ejs', {posts: results});
		});
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
				var content = {
					pseudo: ent.encode(pseudo),
					message: ent.encode(message)
				};
				socket.broadcast.emit('message', content);
				posts.save(content);
			}
		});
	});
});
