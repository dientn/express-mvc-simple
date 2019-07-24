const passport = require('passport');

/**
 * jwt authenticate middlewares
 */
module.exports = [
	(req, res, next ) => {
		passport.authenticate('jwt-cookiecombo', {
			session: false,
		}, () => {
			return next();
		})(req, res);
	},
];
