"use strict";

/**
 * Module dependencies.
 */

let mongoose = require( "mongoose" ),
	path = require('path'),
	config = require(path.resolve('./config')),
	moment = require('moment'),
	Schema = mongoose.Schema;

let CountrySchema = new Schema( {
	_id: {
		type: Number,
		// index: true
	},
	short_name: {
		type: String,
		index: true
	},
	name: String,
	phone_code: {
		type:Number,
		index: true
	},
	created_time: Number,
	updated_time: Number
}, {
	_id: false,
	autoIndex: config.dbAutoIndex,
	validateBeforeSave: false
} );

/**
 * Pre-save hook
 */
CountrySchema.pre( "save", ( next ) => {
	// this.increment();
	let now = +moment.utc();

	if(this.isNew) {
		this.created_time = now;
	}
	this.updated_time = now;
	next();
} );

mongoose.model( "Country", CountrySchema, config.dbTablePrefix.concat( "countries" ) );
