const users = [];

function userJoin(id, username, server) {
	const user = { id, username, server };

	users.push(user);

	return user;
}

function getCurrentUser(id) {
	return users.find(user => user.id === id);
}

function userLeave(id) {
	const index = users.findIndex(user => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

function getServerUser(server) {
	return users.filter(user => user.server === server);
}

module.exports = { userJoin, getCurrentUser, userLeave, getServerUser };