'use strict';

/**
 * @author: dientran
 * Module dependencies.
 */

let User = require('../models/user.model');
let baseService = require('./base');
let mailer = require('../helpers/email');
let constants = require('../resources/constants');
let config = require('../../config');

/**
 * add a new user
 * author : dientran
 */
exports.add = (user, next) => {

	let newUser = new User(user);

	// set the user's local credentials
	newUser.provider = 'local';

	newUser.save((err) => {
		if (err) {
			return next(err);
		}
		if(next) {
			return next(null, newUser);
		}
	});
};

/**
 * get user by email
 * author : dientran
 */
exports.getUserByEmail = (email, next) => {

	User.findOne({ 'email' :  email }, (err, user) => {
		// if there are any errors, return the error
		if (err) {
			return next(err);
		}

		return next(null, user);
	});
};


exports.findOneAndUpdate = (query, update, next) => {
	let options = { new: true };

	baseService.findOneAndUpdate('User', query, update, options, next);
};

exports.findByIdAndUpdate = (id, update, next) => {
	let options = { new: true };

	baseService.findByIdAndUpdate('User', id, update, options, next);
};

exports.findByIdAndRemove = (id, options = {}, next) => {
	baseService.findByIdAndRemove('User', id, options, next);
};


exports.activateEmail = (user_name, email, activate_code) => {
	console.log('Start send email confirm');
	let data = {
		name: user_name,
		host: `${config.protocol}://${config.host}${config.port ? ':' + config.port : ''}${config.basePath}`,
		email,
		activate_code
	};

	// setup e-mail data with unicode symbols
	let mailOptions = {
		to: email, // list of receivers
		subject: `Welcome to ${constants.APP_NAME}!`, // Subject line
	};

	let options = {
		template: constants.ACTIVATE_TEMPLATE,
		data,
		mailOptions
	};

	// send mail with defined transport object
	mailer.sendMail(options, (error) => {
		if (error) {
			return console.error(error);
		}
		console.log('send confirm email success');
	});
};

exports.findById = (id, next) => {
	baseService.findById('User', id, next);
};

exports.paginate = (queries = {}, options = {}, next) => {
	let selectDefault = "-password -security_hash";

	if(options.select) {
		options.select = options.select.replace(/(\s*)password/gi, '')
			.replace(/(\s*)security_hash/, '');
	}

	// set default if select is empty
	options.select = options.select || selectDefault;

	baseService.paginate('User', queries, options, next);
};

exports.count = (queries = {}, next) => {
	baseService.count('User', queries, next);
};

