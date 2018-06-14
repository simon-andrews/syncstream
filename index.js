var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var movieTracker = require('./movieTracker');
var users = require('./users');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/resources/index.html');
});

app.get('/mov_bbb.mp4', function(req, res) {
	res.sendFile(__dirname + '/resources/mov_bbb.mp4');
});

const CHAT_MESSAGE = 'chat message';
const PLAY_COMMAND = 'play command';
const PAUSE_COMMAND = 'pause command';
const SEEK_COMMAND = 'seek command';

var movie = new movieTracker.Movie();

io.on('connection', function(socket) {

	let user = new users.User('Anonymous coward', socket.id);

	socket.on('disconnect', function() {
		console.log('user disconnected');
		io.emit(CHAT_MESSAGE, user.nickName, ' has disconnected');
		users.removeUser(socket.id);
	});

	socket.on(CHAT_MESSAGE, function(msg) {
		console.log('message: ' + msg);
		io.emit(CHAT_MESSAGE, user.nickName + ': ' + msg);
	});

	socket.on(PLAY_COMMAND, function() {
		io.emit(CHAT_MESSAGE, user.nickName + ' started playback');
		socket.broadcast.emit(PLAY_COMMAND, '');
	});

	socket.on(PAUSE_COMMAND, function() {
		io.emit(CHAT_MESSAGE, user.nickName + ' paused playback');
		socket.broadcast.emit(PAUSE_COMMAND, '');
	});

	socket.on(SEEK_COMMAND, function(msg) {
		console.log('got seek command');
		io.emit(CHAT_MESSAGE, user.nickName + ' set time to ' + msg);
		socket.broadcast.emit(SEEK_COMMAND, msg);
	});

	socket.on('test message', function(msg) {
		console.log(msg);
	});

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});
