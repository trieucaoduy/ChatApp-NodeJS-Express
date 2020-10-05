const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.body-chat');
const serverName = document.getElementById('server-name');
const userList = document.getElementById('users');

const { username, server } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, server });


socket.on('roomUsers', ({ server, users }) => {
	outputServerName(server);
	outputUsers(users);
	console.log(server);
})

socket.on('message', message => {
	outputMessage(message);

	chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get message to server
	const msg = e.target.elements.message.value;

	//Emit message to server
	socket.emit('chatMessage', msg);

	//Clear input
	e.target.elements.message.value = '';
	e.target.elements.message.focus();
});

function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('chat-message');
	div.innerHTML =
	`<div class="chat-text">${message.text}</div>
	<div class="chat-sub">
	<span>${message.username}</span> - <span>${message.time}</span>
	</div>`;
	document.getElementById('content').appendChild(div);
}

function outputServerName(server) {
	serverName.innerText = server;
}


function outputUsers(users) {
	userList.innerHTML = `
		${users.map(user => `<li><i class="fas fa-circle"></i> ${user.username}</li>`).join('')}
	`;
}