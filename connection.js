const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(
		'mongodb+srv://dbUser:dbUser@cluster0.7e0w6.mongodb.net/makesApp?retryWrites=true&w=majority',
		{
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useFindAndModify: false,
		},
	);
};

module.exports = connectDB;
