'use strict';

/*
* auth.js
* authentication system handler
*
*/

let authService = require('../services/auth');
let validate = require('../validators/user');
let userService = require('../services/user');
let config = require('../../config');
let utils = require('../helpers/utils');
const jwt = require('jsonwebtoken');
let enums = require('../resources/enums/core.enums');

exports.signup = [
	// validate user info
	(req, res, next) => {
		return validate.validateAdd(req.body, next);
	},
	// check exist user
	(req, res, next) => {
		let email = req.body.email;

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		userService.getUserByEmail(email, (err, user) => {

			// if there are any errors, return the error
			if (err) {
				return next(err);
			}
			// check to see if theres already a user with that email
			if (user) {
				return next(new TypeError('Email already exists. Please use another email.'));
			}

			return next();
		});
	},
	( req, res, next) => {

		// save the user
		req.body.balance = config.defaultPoint; // default point
		req.body.roles = [ enums.UserRoles.Agency ]; // agency
		req.body.status = enums.UserStatus.Inactive; // inactive for email activators
		req.body.security_hash = utils.generateHash();

		userService.add(req.body, ( errSave, user ) => {
			if (errSave) {
				return next(errSave);
			}

			// send activate link to email
			let activate_code = user.security_hash;
			userService.activateEmail(user.first_name, user.email, activate_code);
			user.security_hash = undefined;
			user.password = undefined;

			res.json(user);// response
		});
	}
];

exports.signupConfirm = [
	(req, res, next) => {
		let email = req.query.email;
		let active_code = req.query.active_code;
		let query = {
			email :  email,
			security_hash:  active_code
		};
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists

		userService.findOneAndUpdate(query, { security_hash: '', status: enums.UserStatus.Active }, (err, user) => {
			// if there are any errors, return the error
			if (err) {
				return next(err);
			}

			// check to see if theres already a user with that email
			if (!user) {
				return res.send(res.const.verify_invalid);
				// return next(new TypeError('User does not exist'));
			}

			user.password = undefined;
			user.security_hash = undefined;
			res.render('signup-confirm', {user});
		});
	},
];

let loggedIn = (req, res, next) => {
	if (req.user) {
		return res.json(req.user);
	}

	return next();
};

let saveSession = (req, res) => {
	req.body.remember_me = Boolean(req.body.remember_me);
	let user = req.user;
	let cookie = config.jwt.cookie;
	// Create and sign json web token with the user as payload
	let token = jwt.sign({ user: user }, config.jwt.secret, config.jwt.options);

	if (!req.body.remember_me) {
		// update session
		let hour = 3600000; // 1 hour expire

		cookie.maxAge = hour;
	}

	// Send the Set-Cookie header with the jwt to the client
	res.cookie('jwt', token, cookie);
	// Remove sensitive data before login
	user.password = undefined;
	user.security_hash = undefined;
	// Response json with the jwt
	res.json({
		user,
		token
	}); // response data
};

exports.signin = [
	loggedIn,
	( req, res, next ) => {
		authService.authenticate(req.body, false, (err, user) => {
			if (err) {
				return next(err);
			}
			req.user = user;
			return saveSession(req, res);
		});
	}
];

exports.adminSignin = [
	loggedIn,
	( req, res, next ) => {
		authService.authenticate(req.body, true, (err, user) => {
			if (err) {
				return next(err);
			}

			req.user = user;
			return saveSession(req, res);
		});
	}
];

/**
 * Sign out
 * @author: dientran
 */
exports.signout = (req, res) => {
	if(!req.user) {
		return res.json({ success: true });
	}
	// if single sign on exists in current session => redirect to setting logout url
	if (req.headers && req.headers.authorization) {
		delete req.headers.authorization;
	}

	res.clearCookie("jwt");
	res.json({ success: true });
};
