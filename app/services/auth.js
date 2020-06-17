'use strict';

let userService = require('./user');
let constants = require('../resources/constants');
let enums = require('../resources/enums/core.enums');

exports.authenticate = (data = {}, is_admin = false, done) => {
	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	userService.getUserByEmail(data.email, (err, user) => {
		// if there are any errors, return the error before anything else
		if (err) {
			return done(err, false);
		}

		// if no user is found, return the message
		if (!user) {
			return done( new TypeError(constants.signin_failed), false);
		}

		// if the user is found but the password is wrong
		if (!user.authenticate(data.password || '')) {
			return done(new TypeError(constants.signin_failed), false);
		}

		if(user.status === enums.UserStatus.Inactive && user.security_hash) {
			return done(new TypeError(constants.signin_failed), false);
		}

		if(user.status === enums.UserStatus.Inactive) {
			return done(new TypeError(constants.user_inactive), false);
		}

		// if the user is found but role is not admin, return the message
		if ( !user.roles.includes(enums.UserRoles.Admin) && is_admin) {
			return done( new TypeError(constants.signin_failed), false);
		}

		// all is well, return successful user

		return done(null, user);
	});
};
