'use strict';

let rContext = require('require-context'),
	path = require('path'),
	enums = require( '../../resources/enums/core.enums' ),
	ACL = require( 'acl' );

// Using the memory backend
let acl = new ACL( new ACL.memoryBackend() );
let polices = [];
let files = rContext(path.resolve('./app/routes/policies/'), true, /\.js$/);


files.keys().forEach((file) => {
	if(file === 'index.js') {
		return;
	}
	polices = polices.concat(files(file));
});

/**
 * Invoke User Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow( polices );
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function( req, res, next ) {
	if(!req.user) {
		return next( { type: 'unauthorized', message: res.const.unauthorized } );
	}

	let roles = ( req.user ) ? req.user.roles : [ enums.UserRoles.Guest ];

	// Check for user roles
	acl.areAnyRolesAllowed( roles, req.route.path, req.method.toLowerCase(), ( err, isAllowed ) => {
		if ( err ) {
			// An authorization error occurred.
			return next( new TypeError( res.const.unauthorized ) );
		}

		if ( isAllowed ) {
			// Access granted! Invoke next middleware
			return next();
		}

		return next( new TypeError( res.const.not_granted ) );

	} );
};

/**
 * Check If Device Policy Allows
 */
exports.isDeviceAllowed = function( req, res, next ) {
	if(!req.device) {
		return next( { type: 'unauthorized', message: res.const.unauthorized } );
	}
	return next();
};
