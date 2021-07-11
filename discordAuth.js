const router = require('express').Router();
const jwt = require('jsonwebtoken');
const btoa = require('btoa');
const fetch = require('node-fetch');

const redirect = encodeURIComponent('https://login-discord-passport.herokuapp.com/api/auth/callback');
router.get('/login', (req,res)=>{
	res.redirect(
		`https://discord.com/api/oauth2/authorize?client_id=827119255111467008&scope=identify%20email&response_type=code&redirect_uri=${redirect}`
	);
});
router.get('/callback', async (req,res,next)=>{
	if (!req.query.code) return next( 'NoCodeProvided');
	const { code } = req.query;
	const creds = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
	const data = {
		grant_type: 'authorization_code',
		client_id: 827119255111467008,
		client_secret: '9WGLqqJ4tQta9wEDhpf5c0qDN5FzDCnO',
		code,
		redirect_uri:'https://login-discord-passport.herokuapp.com/api/auth/callback',
		scope: "identify email",
	};
	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${creds}`,
			'Content-type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(data),
	});
	// eslint-disable-next-line camelcase
	const { access_token, refresh_token, expires_in } = await response.json();
	const token = jwt.sign({ id: access_token }, process.env.JWT_SECRET, {
		expiresIn: expires_in,
	});
	const cookieOptions = {
		// eslint-disable-next-line camelcase
		expires: new Date(Date.now() + expires_in * 24 * 60 * 60 * 1000),
	};
	if (process.env.ENVIRONMENT === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);
	res.redirect(`/success/?token=${access_token}`);
});

router.get('/me',async(req,res,next)=>{
	const fetchDiscordUserInfo = await fetch(
		'https://discord.com/api/users/@me',
		{
			headers: {
				Authorization: `Bearer ${req.query.token}`,
			},
		}
	);
	const userInfo = await fetchDiscordUserInfo.json();
	res.status(200).send({data:userInfo});
})


module.exports = router;
