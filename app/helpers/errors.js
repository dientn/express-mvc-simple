'use strict';
//
//  errors.js
//  handle system errors
//
//  Created by dientran on 2019-03-12.
//

let mongoose = require( 'mongoose' );

/**
 * Get unique error field name
 */
exports.getUniqueErrorMessage = ( err ) => {
	// if not unique
	if( err.code !== 11000 && err.code !== 11001 ) {
		return '';
	}
	try {
		let fieldName = err.errmsg.substring( err.errmsg.lastIndexOf( 'index' ) + 7, err.errmsg.lastIndexOf( '_1' ) );

		return new Error( fieldName );
	} catch ( ex ) {
		return '';
	}
};

/**
 * build single error message
 */
exports.getSingleMessage = ( err ) => {
	return {
		"single": err,
	};
};

/**
 * build mongoose the error message from error object
 */
exports.validationError = ( errors ) => {
	let ValidationError = mongoose.Error.ValidationError,
		error = new ValidationError( this );

	error.code = 10000;
	error.message = errors;
	return error;
};
