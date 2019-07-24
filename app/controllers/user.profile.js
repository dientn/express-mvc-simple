'use strict';

/*
* user.profile.js
* user info handler
*
*/

/**
 * Module dependencies.
 */
let _ = require('lodash'),
	enums = require('../resources/enums/core.enums'),
	validate = require('../validators/user'),
	userService = require('../services/user'),
	file = require('../helpers/file'),
	config = require('../../config/env/default'),
	path = require('path'),
	fs = require('fs');

/**
 * Update user details
 */
module.exports.update = [
	(req, res, next) => {
		// remove sensitive data
		delete req.body.password;
		delete req.body.confirmed_password;
		delete req.body.roles;
		delete req.body.security_hash;
		delete req.body.provider;
		delete req.body.email;

		// Init Variables
		let user = req.user;

		// Merge existing user
		user = _.assign(user, req.body);
		validate.validateUpdateProfile(user, next);
	},
	(req, res, next) => {
		const id = req.user._id;
		const logo = req.file;
		const distPath = config.upload.path;
		const dirUser = `${distPath}${id}/${req.user.picture}`;

		delete req.body.picture;

		if(req.file) {
			req.body.picture = req.file.uploadfilename;
		}

		if(req.body.is_remove_logo) {
			req.body.picture = '';
		}

		userService.findByIdAndUpdate( req.user._id, req.body, (errUpdate, user) => {
			if (errUpdate) {
				return next(errUpdate);
			}

			if(req.file) {
				file.removeFile(dirUser, () => {
					logo.filename = req.file.uploadfilename;
					file.moveFile(id, [ logo ]);
				});
			}
			// Send the Set-Cookie header with the jwt to the client
			res.json(user);
		});
	}
];

/**
 * suspend a user
 * @author : dientran
 */
module.exports.suspend = (req, res, next) => {

	// set suspended status for user
	User.findByIdAndUpdate(req.user._id, { status: enums.UserStatus.suspended }, (err, user) => {
		if (err) {
			return next(err);
		}
		user.security_hash = undefined;
		user.password = undefined;
		res.json(req.user);
	});
};

/**
 * Send User
 * @author : dientran
 */
module.exports.me = (req, res) => {
	userService.findById(req.user._id, (err, user) => {
		if(err) {
			return next(res.const.not_found);
		}

		res.json(user);
	});

};


/**
 * get the current user setting
 * @author : dientran
 */
exports.userById = (req, _res, next) => {
	if (!req.user) {
		return next(new TypeError('User not found'));
	}
	User.findById(req.user._id, (err, user) => {
		if (err) {
			return next(err);
		}
		if (!user || user.is_suspended) {
			return next(new TypeError('User not found'));
		}
		req.user = user;
		next();
	});
};

exports.avatar = (req, res) => {
	const idUser = req.params.id;
	const fileName = req.params.picture;
	const avatarPath = config.upload.path;
	const filePath = `${avatarPath}${idUser}/${fileName}`;
	const defaultLogo = path.resolve('./public/img/default-avatar.png');

	if(!fileName || !fs.existsSync(filePath)) {

		return res.sendFile(defaultLogo);
	}

	res.sendFile(filePath, { root: '.' });
};

