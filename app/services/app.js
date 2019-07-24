'use strict';

/**
 * @author: dientran
 * Module dependencies.
 */


let baseService = require('./base');
let App = require('../models/app.model');


/**
 * get all app
 */
exports.findAvailable = ( next) => {
	let query = {
		is_active: true
	};

	baseService.find('App', query, null, {}, next);
};

/**
 * add a app
 */
exports.add = (app, next) => {

	let newApp = new App(app);

	// set the user's local credentials

	newApp.save((err) => {
		if (err) {
			return next(err);
		}
		if(next) {
			return next(null, newApp);
		}
	});
};

/**
 * update a app
 */
exports.update = (id, update, next) => {

	baseService.findOneAndUpdate('App', { _id: id }, update, { new: true }, (errUpdate, app) => {
		if (errUpdate) {
			return next(errUpdate);
		}

		return next(null, app);
	});
};

/**
 * get app by ID
 */
exports.findById = (id, next) => {
	baseService.findById('App', id, next);
};

/**
 * get app by device ID
 */
exports.findByDeviceId = (deviceId, next) => {
	baseService.findOne('App', { 'device_id' :  deviceId }, next);
};

/**
 * get app by client ID
 */
exports.findByClientId = (clientId, next) => {
	baseService.findOne('App', { 'client_id' :  clientId }, next);
};

exports.remove = (id, options = {}, next) => {
	baseService.findByIdAndRemove('App', id, options, next);
};

