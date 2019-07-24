'use strict';

let coreService = require('../services/core');
let userService = require('../services/user');


/**
 * Check user email exists
 */
exports.checkUserEmail = [
	(req, res, next) => {
		let email = req.params.email;

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		userService.getUserByEmail(email, (err, user) => {
			// if there are any errors, return the error
			if (err) {
				return next(err);
			}

			res.json({ exists: !!user });
		});
	}
];

exports.listTimeZone = [
	(req, res, next) => {
		let page = req.query.page;
		let noLimit = !!req.query.all;
		let sort = req.query.sort || '+value';
		let select = req.query.fields;
		let search = req.query.search;
		let query = {};
		let pageOpts = {
			page,
			noLimit,
			sort,
			select
		};
		let searchExp = { '$regex' : search, '$options' : 'i' };// new RegExp(`${search}`);

		if(search) {
			let $or = [];

			$or = [
				{
					text: searchExp
				},
				{
					display_text: searchExp
				}
			];

			query.$or = $or;
		}

		coreService.listTimeZone(query, pageOpts, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json(result);
		});
	}
];

exports.listCountry = [
	(req, res, next) => {
		let page = req.query.page;
		let noLimit = !!req.query.all;
		let limit = req.query.per_page;
		let sort = req.query.sort || '+name';
		let select = req.query.fields;
		let search = req.query.search;
		let query = {};
		let pageOpts = {
			page,
			noLimit,
			limit,
			sort,
			select
		};
		let searchExp = { '$regex' : search, '$options' : 'i' };// new RegExp(`${search}`);

		if(search) {
			let $or = [
				{
					name: searchExp
				}
			];

			query.$or = $or;
		}

		coreService.listCountry(query, pageOpts, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json(result);
		});
	}
];

exports.listState = [
	(req, res, next) => {
		let page = req.query.page;
		let noLimit = !!req.query.all;
		let limit = req.query.per_page;
		let sort = req.query.sort || '+name';
		let select = req.query.fields;
		let search = req.query.search;
		let country = req.query.country;
		let query = {};
		let $and = [];

		let pageOpts = {
			page,
			noLimit,
			limit,
			sort,
			select
		};
		let searchExp = { '$regex' : search, '$options' : 'i' };// new RegExp(`${search}`);

		if(country) {
			$and.push({
				country_id: country
			});
			query.$and = $and;
		}

		if(search) {
			let $or = [
				{
					name: searchExp
				}
			];

			if($and.length) {
				query.$and.push({ $or: $or });
			}
			else{
				query.$or = $or;
			}
		}

		coreService.listState(query, pageOpts, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json(result);
		});
	}
];

exports.listCity = [
	(req, res, next) => {
		let page = req.query.page;
		let noLimit = !!req.query.all;
		let limit = req.query.per_page;
		let sort = req.query.sort || '+name';
		let select = req.query.fields;
		let search = req.query.search;
		let state = req.query.state;
		let query = {};
		let $and = [];

		let pageOpts = {
			page,
			noLimit,
			limit,
			sort,
			select
		};
		let searchExp = { '$regex' : search, '$options' : 'i' };// new RegExp(`${search}`);

		if(state) {
			$and.push({
				state_id: state
			});
			query.$and = $and;
		}

		if(search) {
			let $or = [
				{
					name: searchExp
				}
			];

			if($and.length) {
				query.$and.push({ $or: $or });
			}
			else{
				query.$or = $or;
			}
		}

		coreService.listCity(query, pageOpts, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json(result);
		});
	}
];
