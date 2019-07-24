let validate = require('../ext/validators/validate'),
	errorHandler = require('../helpers/errors');

exports.validateLocation = (data, next) => {
	let constraints = {
		"location": {
			isGeoJSON: true
		}
	};

	let success = () => {
			return next();
		},
		error = (errors) => {
			next(errorHandler.validationError(errors));
		};

	validate.async(data, constraints).then(success, error);
};

