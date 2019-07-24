'use strict';

/**
 * Module dependencies.
 */
let config = require( '.' ),
	express = require( 'express' ),
	passport = require( 'passport' ),
	database = require( './lib/database' ),
	middleware = require( '../app/middlewares' ),
	chalk = require( 'chalk' ),
	app = express(),
	initHandlerError = require('./errors'),
	db = database.connect();

// Initialize handler system error
initHandlerError();

// Initialize Models
database.loadModels();


// eslint-disable-next-line global-require
require('./lib/passport')(passport);

// Init express middleware
middleware(db, app);

// Start the app by listening on <port>
app = app.listen( config.port, () => {
	if(process.env.NODE_ENV !== 'test') {
		// Logging initialization
		console.log( '--' );
		console.log( chalk.green( config.app.title ) );
		console.log( chalk.green( `Environment:\t\t\t${process.env.NODE_ENV || config.env}` ) );
		console.log( chalk.green( `Listening on Port:\t\t\t\t${config.port}` ) );
		console.log( chalk.green( `Database:\t\t\t\t${config.db.uri}` ) );
		if ( process.env.NODE_ENV === 'secure' ) {
			console.log( chalk.green( 'HTTPs:\t\t\t\ton' ) );
		}
		console.log( '--' );
	}
} );


module.exports = app;
