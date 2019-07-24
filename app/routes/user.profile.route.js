"use strict";

// Load Module dependencies.
let user = require('../controllers/user.profile');
let	upload = require('../helpers/upload');
let uploadOpts = {
	mimetype : "image/jpeg image/png image/gif",
	single: 'logo'
};

module.exports = ( router, policies ) => {
	router.route('/me')
		.all( policies.isAllowed)
		.get( user.me )
		.put( upload(uploadOpts), user.update );

	router.route('/user/:id/avatar/:picture')
		.get(user.avatar);
};
