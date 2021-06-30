const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const User = require('./modules/db/user');

passport.serializeUser((user, done) => {
	console.log('Serialize');
	done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
	console.log('Deserializing');
	try {
		const user = await User.findOne({ discordId });
		return user ? done(null, user) : done(null, null);
	} catch (err) {
		console.log(err);
		done(err, null);
	}
});

passport.use(
	new DiscordStrategy(
		{
			clientID: '827119255111467008',
			clientSecret: '9WGLqqJ4tQta9wEDhpf5c0qDN5FzDCnO',
			callbackURL: '/api/auth/discord/redirect',
			scope: ['identify', 'email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			const { username, avatar, id } = profile;
			try {
				const user = await User.findOne({ discordId: profile.id });
				if (user) {
					console.log('User exists.');
					done(null, user);
				} else {
					console.log('User does not exist');
					const newUser = await User.create({
						discordId: id,
						userName: username,
						userAvatar: avatar,
						userLikes: [],
						userMakes: [],
					});
					const savedUser = await newUser.save();
					done(null, savedUser);
				}
			} catch (err) {
				console.log(err);
				done(err, null);
			}
		},
	),
);
