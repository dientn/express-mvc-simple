'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
	config = require(path.resolve('./config')),
	policies = require(path.resolve('./app/routes/policies')),
	jwt = require('../helpers/jwt'),
	rContext = require('require-context');

/**
 * Configure error handling
 */
module.exports = (app, router) => {

	policies.invokeRolesPolicies();

	let files = rContext(path.resolve('./app/routes'), true, /\.route.js$/);

	files.keys().forEach((routePath) => {
		files(routePath)(router, policies);
	});

	app.use(config.basePath, jwt);
	app.use(config.basePath, router);
};
