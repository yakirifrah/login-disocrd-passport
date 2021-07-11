
const express = require('express');
const http = require('http');
const passport = require('passport');
const discordAuth = require('./discordAuth');
const cookieParser = require('cookie-parser');
const Store = require('connect-mongo');

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/discord', discordAuth);

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 5000, () => {
	console.log('welcome to my server');
});
