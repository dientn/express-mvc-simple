'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
	passport = require('passport'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	config = require('../../config'),
	cors = require('cors'),
	cookieParser = require('cookie-parser');

/**
 * Initialize application middleware
 */
module.exports = (app) => {

	//set view engine
	app.set('views', path.resolve( './app/views'));
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'ejs');

	// Showing stack errors
	app.set('showStackError', true);

	// Enable jsonp
	app.enable('jsonp callback');

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// for parsing application/json
	app.use(bodyParser.json({
		verify: function(req, res, buf) {
			// get raw_json_body
			req.raw_json_body = buf.toString();
			try {
				JSON.parse(req.raw_json_body);
			} catch (e) {
				throw new TypeError('Input data invalid');
			}
		},
		limit: '15mb'
	}));

	// for parsing application/www-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: '15mb'
	}));

	// Request body parsing middleware should be above methodOverride
	app.use(methodOverride('X-HTTP-Method')); //          Microsoft
	app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
	app.use(methodOverride('X-Method-Override')); //      IBM

	// Add the cookie parser and flash middleware
	app.use(cookieParser(config.jwt.secret));

	// enable CORS
	// Enable preflight requests for all routes
	app.use(cors({
		origin: true,
		credentials: true
	}));

	app.use(passport.initialize());

	// load swagger
	if (process.env.NODE_ENV !== 'test') {

		let swaggerUi = require('swagger-ui-express'),
			swaggerDocument = require(path.resolve('./config/swagger'));

		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
	}
};
