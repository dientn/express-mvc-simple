"use strict";

// Load Module dependencies.
let auth = require('../../controllers/auth.app');

module.exports = ( router, policies ) => {
	router.route('/apps/auth').post( policies.isDeviceAllowed, auth.authenticate );
};
