'use strict';

/**
 * Module dependencies.
 */
let constants = require('../resources/constants');

/**
 * Initialize local variables
 */
module.exports = (app) => {
	// Setting application local variables

	// Passing the request url to environment locals
	app.use((req, res, next) => {
		const names = (req.hostname || "").split(".");

		res.const = constants;
		res.locals.sub_domain = names.length > 2 ? names[ 0 ] : null;
		res.locals.host = `${req.protocol}://${req.hostname}`;
		res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
		res.locals.short_url = `${req.protocol}://${req.headers.host}`;

		next();
	});
};
