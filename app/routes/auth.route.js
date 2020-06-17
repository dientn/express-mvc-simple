"use strict";

// Load Module dependencies.
let auth = require('../controllers/auth');

module.exports = ( router, policies ) => {
	router.post( '/signup', auth.signup );
	router.get( '/signup-confirm', auth.signupConfirm );
	router.post( '/signin', auth.signin );
	router.route('/signout').all(policies.isAllowed).get( auth.signout );
	
	router.post( '/admin-signin', auth.adminSignin );
};
