let LocalStrategy = require('passport-local').Strategy;
let JwtCookieComboStrategy = require('passport-jwt-cookiecombo');
let mongoose = require('mongoose');
let User = mongoose.model('User'); // require('../../app/models/user');
let userService = require('../../app/services/user');
let constants = require('../../app/resources/constants');
let enums = require('../../app/resources/enums/core.enums');
let config = require('../');

let JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
// let dateFormat = require('dateformat');


// expose this function to our app using module.exports
module.exports = (passport) => {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// // used to serialize the user for the session
	passport.serializeUser((req, user, done) => {
		console.log(req.user);
		done(null, user);
	});

	// used to deserialize the user
	passport.deserializeUser((id, done) => {
		console.log('==================');
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	// // Deserialize sessions
	// passport.deserializeUser( (req, userSession, done) => {
	// 	console.log(req, userSession);
	// 	User.findById(id, done);
	// });


	// =========================================================================
	// LOCAL LOGIN =============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use( new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true, // allows us to pass back the entire request to the callback
		session: false
	},
	((req, email, password, done) => { // callback with email and password from our forms

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		userService.getUserByEmail(email, (err, user) => {
			// if there are any errors, return the error before anything else

			if (err) {
				return done(err, false);
			}


			// if no user is found, return the message
			if (!user) {
				return done( new TypeError(constants.signin_failed), false);
			}


			// if the user is found but the password is wrong
			if (!user.authenticate(password)) {
				return done(new TypeError(constants.signin_failed), false);
			}

			if(user.status === enums.UserStatus.Inactive) {
				return done(new TypeError(constants.signin_failed), false);
			}

			// all is well, return successful user
			req.user = user;

			return done(null, user);
		});

	})));

	passport.use(constants.ADMIN_LOGIN, new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true, // allows us to pass back the entire request to the callback
		session: false
	},
	((req, email, password, done) => { // callback with email and password from our forms

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		userService.getUserByEmail(email, (err, user) => {
			// if there are any errors, return the error before anything else

			if (err) {
				return done(err, false);
			}

			// if no user is found, return the message
			if (!user) {
				return done( new TypeError(constants.signin_failed), false);
			}

			// if the user is found but role is not admin, return the message
			if (!user.roles.includes(enums.UserRoles.Admin)) {
				return done( new TypeError(constants.signin_failed), false);
			}

			// if the user is found but the password is wrong
			if (!user.authenticate(password)) {
				return done(new TypeError(constants.signin_failed), false);
			}

			if(user.status === enums.UserStatus.Inactive) {
				return done(new TypeError(constants.signin_failed), false);
			}

			// all is well, return successful user
			req.user = user;

			return done(null, user);
		});

	})));

	passport.use(new JwtCookieComboStrategy({
		secretOrPublicKey: config.jwt.secret,
		jwtVerifyOptions: config.jwt.options,
		passReqToCallback: true,
		jwtHeaderKey: 'Authorization'
	}, (req, payload, done) => {
		req.token = req.get('Authorization');
		req.user = payload.user;
		req.device = payload.app;
		return done(null, payload.user || payload.app, {});
	}));

	passport.use(new JwtStrategy({
		secretOrKey: config.jwt.secret,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		passReqToCallback: true
	}, (req, payload, done) => {
		req.token = req.get('Authorization');
		req.user = payload.user;
		return done(null, payload.user, {});
	}));
};

