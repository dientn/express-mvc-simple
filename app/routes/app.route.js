"use strict";

// Load Module dependencies.
let app = require('../controllers/app');

module.exports = ( router, policies ) => {
	router.route('/devices').all( policies.isAllowed ).get( app.getAvailables );
};
