'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
	constants = require('../resources/constants'),
	mongoose = require('mongoose'),
	errorHandler = require(path.resolve('./app/helpers/errors'));
	
/**
 * Configure error handling
 */
module.exports = (app) => {
	let HTTP_CODE = constants.HTTP_CODE;

	app.use((err, req, res, next) => {
		// If the error object doesn't exists
		if (!err) {
			return next();
		}
		if (err.type === "unauthorized") {
			return res.status(HTTP_CODE.UNAUTHORIZED).send({
				errors: errorHandler.getSingleMessage(err.message)
			});
		}

		// send a single error back
		if (err instanceof TypeError) {
			// send back a single message
			return res.status(HTTP_CODE.BAD_REQUEST).send({
				errors: errorHandler.getSingleMessage(err.message)
			});
		}
		// send a validation errors back
		if (err instanceof mongoose.Error.ValidationError) {
			// send back a single message
			return res.status(HTTP_CODE.BAD_REQUEST).send({
				errors: err.message
			});
		}

		if (err instanceof mongoose.Error.CastError) {
			// send back a single message
			return res.status(HTTP_CODE.BAD_REQUEST).send({
				errors: err.message
			});
		}

		if (err.type === "entity.too.large") {
			return res.status(HTTP_CODE.BAD_REQUEST).send({
				errors: errorHandler.getSingleMessage(constants.entity_too_large)
			});
		}
		let isUnique = errorHandler.getUniqueErrorMessage(err);

		if (isUnique instanceof Error) {
			// send back a unique message
			let err_ = {
				errors: {
					[ isUnique.message ]: constants.unique
				}
			};

			if (err.op) {
				err_._id = err.op._id;
			}
			return res.status(HTTP_CODE.BAD_REQUEST).send(err_);
		}

		// Log it and send mail
		console.error(err, res.locals.url);

		// send a clean 500 error back to user
		res.status(HTTP_CODE.INTERNAL_SERVER).send({
			errors: errorHandler.getSingleMessage(constants.internal_server)
		});
	});
};
