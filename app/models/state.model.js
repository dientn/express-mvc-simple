"use strict";

/**
 * Module dependencies.
 */

let mongoose = require( "mongoose" ),
	path = require('path'),
	config = require(path.resolve('./config')),
	moment = require('moment'),
	Schema = mongoose.Schema;

let StateSchema = new Schema( {
	_id: {
		type: Number,
		// index: true
	},
	name: String,
	country_id: {
		type: Number,
		ref: 'Country'
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
StateSchema.pre( "save", ( next ) => {
	// this.increment();
	let now = +moment.utc();

	if(this.isNew) {
		this.created_time = now;
	}
	this.updated_time = now;
	next();
} );

mongoose.model( "State", StateSchema, config.dbTablePrefix.concat( "states" ) );
