require('./discordstrategy');

const express = require('express');
const http = require('http');
const passport = require('passport');
const passportAuth = require('./passportAuth');
const cookieParser = require('cookie-parser');
const Store = require('connect-mongo');
const connectDB = require('./connection');
const session = require('express-session');

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(
	session({
		secret: 'secret',
		cookie: {
			maxAge: 60000 * 60 * 24,
		},
		resave: false,
		saveUninitialized: false,
		store: new Store({
			mongoUrl: 'mongodb+srv://dbUser:dbUser@cluster0.7e0w6.mongodb.net/makesApp?retryWrites=true&w=majority',
		}),
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', passportAuth);

const httpServer = http.createServer(app);
connectDB().then(() => console.log('DB connected!'));
httpServer.listen(process.env.PORT || 5000, () => {
	console.log('welcome to my server');
});
