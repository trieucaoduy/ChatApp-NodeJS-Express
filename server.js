const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave, getServerUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatBot';

io.on('connection', socket => {
	console.log('New WS Connection...');

	socket.on('joinRoom', ({ username, server }) => {
		const user = userJoin(socket.id, username, server);

		socket.join(user.server);


		socket.emit('message',
			formatMessage(botName,
			'Wellcome to ChatApp!'));
		
		socket.broadcast
			.to(user.server)
			.emit('message',
				formatMessage(botName, `${user.username} has joined the chat room!`)
			);

			io.to(user.server).emit('roomUsers', {
				server: user.server,
				users: getServerUser(user.server)
			});
	});

	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.server).emit('message', formatMessage(user.username, msg));
	});

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);
		
		if (user) {
			io.to(user.server).emit(
				'message',
				 formatMessage(botName, `${user.username} has left the chat room!`)
			);

			io.to(user.server).emit('roomUsers', {
				server: user.server,
				users: getServerUser(user.server)
			});
		}
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Sever is running on port ${PORT}`));