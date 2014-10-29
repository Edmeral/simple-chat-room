var express = require('express');
var easymongo = require('easymongo');
var ent = require('ent');
var compression = require('compression');

var PORT = process.env.PORT || 8080;

//Setting up MongoDB
var mongo = new easymongo(process.env.MONGOLAB_URL || 'mongodb://localhost/amando');
var posts = mongo.collection('posts');

//Setting up express
var app = express();
var server = require('http').Server(app);

//Using bzip compression
app.use(compression());

app.use(express.static(__dirname + '/public'))

	.get('/', function(req, res) {
		posts.find(function(error, results) {
			res.render('index.ejs', {posts: results});
		});
	});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

	socket.on('new-user', function(pseudo) {
		socket.pseudo = pseudo;
		socket.broadcast.emit('new-user', ent.encode(pseudo));
	});

	socket.on('message', function(message) {
		var content = {
					pseudo: ent.encode(socket.pseudo),
					message: ent.encode(message)
				};
		socket.broadcast.emit('message', content);
		posts.save(content);
	});
});

console.log("Magic happens at http://localhost:" + PORT);
server.listen(PORT);