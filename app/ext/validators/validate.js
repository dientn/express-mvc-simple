'use strict';
//
//  validate.js
//  define validator js
//

let validate = require("validate.js"),
	moment = require("moment"),
	path = require('path'),
	rContext = require('require-context'),
	_ = require('lodash');

validate.Promise = require('q').Promise;
validate.moment = moment;

// Before using it we must add the parse and format functions
validate.extend(validate.validators.datetime, {
	// The value is guaranteed not to be null or undefined but otherwise it
	// could be anything.
	parse: function(value) {
		return +moment.utc(value);
	},
	// Input is a unix timestamp
	format: function(value, options) {
		let format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm:ss";

		return moment.utc(value).format(format);
	}
});


let files = rContext(path.resolve('./app/ext/validators'), true, /\.validator.js$/);

files.keys().forEach((validatorPath) => {
	files(validatorPath)(validate);
});



module.exports = validate;
