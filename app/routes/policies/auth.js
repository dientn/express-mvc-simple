/* eslint-disable new-cap */
'use strict';

/**
 * Module dependencies.
 */
let enums = require( '../../resources/enums/core.enums' );

module.exports = [
	{
		roles: [ enums.UserRoles.Guest ],
		allows: [
			{
				resources: '/signin',
				permissions: [ "post" ]
			},
			{
				resources: '/signup',
				permissions: [ "post" ]
			},
			{
				resources: '/signup-confirm',
				permissions: "get"
			}
		]
	},
	{
		roles: [ enums.UserRoles.Admin, enums.UserRoles.Agency ],
		allows: [
			{
				resources: '/signout',
				permissions: [ "get" ]
			}
		]
	}
];
