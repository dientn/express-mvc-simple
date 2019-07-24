/* eslint-disable new-cap */
'use strict';

/**
 * Module dependencies.
 */
let enums = require( '../../resources/enums/core.enums' );

module.exports = [
	{
		roles: [ enums.UserRoles.Admin ],
		allows: [
			{
				resources: '/users',
				permissions: [ "get" ]
			},
			{
				resources: '/user/:id',
				permissions: [ "get", "delete", "put" ]
			}
		]
	},
];
