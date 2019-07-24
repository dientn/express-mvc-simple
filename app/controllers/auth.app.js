'use strict';

/*
* auth.app.js
* authentication for mobile system handler
*
*/

let authService = require('../services/auth');
let config = require('../../config');
const jwt = require('jsonwebtoken');

let loggedIn = (req, res, next) => {
	if (req.device) {
		return res.json(req.device);
	}

	return next();
};

let saveSession = (req, res) => {
	req.body.remember_me = Boolean(req.body.remember_me);
	let app = req.device.toJSON();
	let cookie = config.jwt.cookie;
	// Create and sign json web token with the user as payload
	let token = jwt.sign({ app: app }, config.jwt.secret, config.jwt.options);

	// Send the Set-Cookie header with the jwt to the client
	res.cookie('jwt', token, cookie);
	app.token = token
	// Response json with the jwt
	res.json(app); // response data
};

exports.authenticate = [
	loggedIn,
	( req, res, next ) => {
		authService.authApp(req.body, (err, app) => {
			if (err) {
				return next(err);
			}
			req.device = app;
			return saveSession(req, res);
		});
	}
];

