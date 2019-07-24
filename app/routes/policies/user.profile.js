/* eslint-disable new-cap */
'use strict';

/**
 * Module dependencies.
 */
let enums = require( '../../resources/enums/core.enums' );

module.exports = [ {
	roles: [ enums.UserRoles.Admin, enums.UserRoles.Agency ], //  admin vs agency
	allows: [
		{
			resources: '/me',
			permissions: [ "get", "put" ]
		},
		{
			resources: '/avatar',
			permissions: [ "get" ]
		}
	]
} ];
