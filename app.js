'use strict';


/**
 * Module dependencies.
 */
let app = require('./config/app');

module.exports = app;

module.exports.stop = () => {
	app.close();
};
