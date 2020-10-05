const timer = require('moment');

function formatMessage(username, text) {
	return {
		username,
		text,
		time: timer().format('h:mm a')
	}
}

module.exports = formatMessage;