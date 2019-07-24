let appService = require('../services/app');
let validate = require('../validators/app');
let mongoose = require('mongoose');

/**
 *  middleware
 */
let getById = (req, res, next) => {
	// check the validity of id
	let id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return next(new TypeError(res.const.id_invalid));
	}

	// find ad by id
	appService.findById('Ad', id, (err, ad) => {
		if (err) {
			return next(err);
		}

		req.ad = ad;
		next();
	});
};

exports.getAvailables = [
	(req, res, next) => {

		appService.findAvailable((err, apps) => {
			if(err) {
				return next(err);
			}

			res.json(apps);
		});
	}
];

exports.updateLocation = [
	(req, res, next) => {
		validate.validateLocation(req.body, next);
	},
	(req, res, next) => {
		let update = {
			location: req.body.location
		}

		appService.update(req.device._id, update, (err, app) => {
			if(err) {
				return next(err);
			}

			res.json(app);
		});
	}
];


exports.remove = [
	getById,
	(req, res, next) => {
		let id = req.params.id;

		appService.remove('Ad', id, {}, (err) => {
			if (err) {
				return next(err);
			}

			res.json({ success: true });
		});
	}
];
