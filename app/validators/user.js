let validate = require('../ext/validators/validate'),
	constants = require('../resources/constants'),
	enums = require('../resources/enums/core.enums'),
	errorHandler = require('../helpers/errors');

let constraints = {
	email: {
		presence: {
			message: constants.required
		},
		length: {
			maximum: 50,
			tooLong: constants.email_invalid
		},
		email: true
	},
	first_name: {
		presence: {
			message: constants.required
		},

	},
	last_name: {
		presence: {
			message: constants.required
		},

	},
};

exports.validateAdd = (data, next) => {
	constraints = Object.assign(constraints, {
		password: {
			presence: {
				message: constants.required
			},
			format: {
				pattern: "^(?=\\S).*[^.\\s]$",
				message: constants.password_format
			}
		},
		confirmed_password: {
			presence: {
				message: constants.password_confirm_required
			},
			equality: {
				attribute: "password",
				message: constants.password_confirm_not_match
			}
		}
	});

	let success = () => {
			return next();
		},
		error = (errors) => {
			next(errorHandler.validationError(errors));
		};

	validate.async(data, constraints).then(success, error);
};

exports.validateUpdate = (data, next) => {
	let _constraints = {
		name: {
			presence: {
				message: constants.required
			}
		},
		balance: {
			numericality: {
				onlyInteger: true,
				greaterThan: 0
			}
		},
		status: {
			inclusion: {
				within: Object.values(enums.UserStatus),
				message: constants.agency_status_invalid
			}
		},
	};


	let success = () => {
			return next();
		},
		error = (errors) => {
			next(errorHandler.validationError(errors));
		};

	validate.async(data, _constraints).then(success, error);
};

exports.validateUpdateProfile = (data, next) => {
	constraints = {
		name: {
			presence: {
				message: constants.required
			}
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

