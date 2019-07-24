"use strict";

// Load Module dependencies.
let user = require('../controllers/user');

module.exports = ( router, policies ) => {
	router.route('/users')
		.all( policies.isAllowed)
		.get(user.list);

	router.route('/users/:id')
		.get(user.get)
		.put(user.update)
		.delete(user.remove);
};
