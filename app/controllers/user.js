'use strict';

let userService = require('../services/user');
let enums = require('../resources/enums/core.enums');
let validate = require('../validators/user');
let mongoose = require('mongoose');

/**
 *  middleware
 */
let getById = (req, res, next) => {
	// check the validity of id
	let id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return next(new TypeError(res.const.not_found));
	}

	// find client by id
	userService.findById(id, (err, agency) => {
		if (err) {
			return next(err);
		}

		if(!agency) {
			return next(new TypeError(res.const.not_found));
		}

		req.agency = agency;
		next();
	});
};

exports.list = [
	(req, res, next) => {
		let page = req.query.page;
		let limit = req.query.per_page;
		let sort = req.query.sort;
		let select = req.query.fields;

		let search = req.query.search;
		let query = {
			$and: [ {
				roles: { "$in" : [ enums.UserRoles.Agency ] }
			} ]

		};
		let pageOpts = {
			page,
			limit,
			sort,
			select
		};
		let searchExp = { '$regex' : search, '$options' : 'i' };// new RegExp(`${search}`);

		if(search) {
			let $or = [];

			$or = [
				{
					name: searchExp
				},
				{
					email: searchExp
				},
				{
					phone: searchExp
				},
				{
					address: searchExp
				},
				{
					status: searchExp
				}
			];

			query.$and.push({ $or });
		}

		pageOpts.select = select;

		userService.paginate(query, pageOpts, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json(result);
		});
	}
];

exports.get = [
	// find agency by id
	getById,
	(req, res) => {
		let agency = req.agency.toJSON();

		delete agency.password;
		delete agency.security_hash;
		res.json(agency);
	}
];

exports.count = [
	(req, res, next) => {
		let query = req.query.query;

		userService.count(query, (err, result) => {
			if(err) {
				return next(err);
			}

			res.json({ count: result });
		});
	}
];

exports.update = [
	getById,
	(req, res, next) => {
		// remove sensitive data
		delete req.body.password;
		delete req.body.roles;
		delete req.body.security_hash;
		delete req.body.provider;
		delete req.body.email;
		delete req.body.usage;
		validate.validateUpdate(req.body, next);
	},
	(req, res, next) => {
		userService.findByIdAndUpdate(req.params.id, req.body, (err, agency) => {
			if(err) {
				return next(err);
			}
			agency = agency.toJSON();

			delete agency.password;
			delete agency.security_hash;

			res.json(agency);
		});
	}
];

exports.remove = [
	getById,
	(req, res, next) => {
		let id = req.params.id;

		userService.findByIdAndRemove(id, {}, (err) => {
			if (err) {
				return next(err);
			}

			res.json({ success: true });
		});
	}
];

