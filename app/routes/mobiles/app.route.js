"use strict";

// Load Module dependencies.
let app = require('../../controllers/app');

module.exports = ( router, policies ) => {
	router.route('/apps/location').all( policies.isDeviceAllowed ).put( app.updateLocation );
};
