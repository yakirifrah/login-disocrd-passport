const mongoose = require('mongoose');

const { Schema } = mongoose;

const userMakes = new Schema({
	url: {
		type: String,
	},
});

const user = new Schema({
	discordId: {
		type: String,
		required: true,
		unique: true,
	},
	userName: {
		type: String,
	},
	userAvatar: {
		type: String,
	},
	userLikes: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: 'Make',
	},
	userMakes: {
		type: [userMakes],
	},
});

module.exports = mongoose.model('User', user);
