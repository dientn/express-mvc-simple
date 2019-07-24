
// Load Module dependencies.
let core = require('../controllers/core');

module.exports = ( router) => {
	router.route('/timezones')
		.get( core.listTimeZone );

	router.route('/countries')
		.get( core.listCountry );

	router.route('/states')
		.get( core.listState );

	router.route('/cities')
		.get( core.listCity );

	router.route('/user-exists/:email')
		.get( core.checkUserEmail );
};
