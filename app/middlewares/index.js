
'use strict';

let path = require('path'),
	helmet = require('helmet'),
	express = require('express'),
	initLocalVariables = require('./variables.middleware'),
	initCoreMiddleware = require('./core.middleware'),
	initServerRoutes = require('./router.middleware'),
	initErrorRoutes = require('./error.routes.middleware'),
	exHandler = require('./exception.middleware');

/**
 * Configure the modules static routes
 */
let initServingStatic = (app) => {
	// Setting the app router and static folder
	app.use('/static', express.static(path.resolve('public')));
};

/**
 * Configure Helmet headers configuration
 */
let initHelmetHeaders = (app) => {
	// Use helmet to secure Express headers
	let SIX_MONTHS = 15778476000;

	app.use(helmet.xssFilter());
	app.use(helmet.hsts({
		maxAge: SIX_MONTHS,
		includeSubDomains: true,
		force: true
	}));
	app.disable('x-powered-by');
};


module.exports = (db, app) => {

	if (process.env.NODE_ENV !== 'production') {
		initServingStatic(app);
	}

	// Initialize local variables
	initLocalVariables(app);

	// Initialize App core middleware
	initCoreMiddleware(app);

	// Initialize Helmet security headers
	initHelmetHeaders(app);

	// Initialize modules server routes
	initServerRoutes(app, express.Router());

	// Initialize error routes
	initErrorRoutes(app);

	
	// Rejection Handling
	process.on('unhandledRejection', (reason) => {
		if (reason && reason.name !== "ValidationError") {
			console.log(reason);
		}
	});
	
	// Exception Handling
	process.on('uncaughtException', exHandler);


};
