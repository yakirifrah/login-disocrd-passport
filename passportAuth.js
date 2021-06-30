const router = require('express').Router();
const passport = require('passport');

router.get('/discord', passport.authenticate('discord'));
router.get(
	'/discord/redirect',
	passport.authenticate('discord', {
		failureRedirect: '/forbidden',
		successRedirect: '/',
	}),
);
router.get('/logout', (req, res) => {
	if (req.user) {
		req.logout();
		res.redirect('/');
	} else {
		res.redirect('/');
	}
});
// eslint-disable-next-line no-use-before-define


module.exports = router;
