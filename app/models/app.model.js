// Load Module dependencies.
let path = require('path');
let mongoose = require('mongoose');
let config = require(path.resolve('./config'));
let moment = require('moment');
let GeoSchema = require("./geo.schema");

// define the schema for our user model
let AppSchema = mongoose.Schema({
	client_id: String,
	secret: String,
	name: String,
	device_id: String,
	location: GeoSchema.PointSchema,
	is_active: {
		type: Boolean,
		default: false,
	},
	created_time: {
		type: Number,
		index: true
	},
	updated_time: Number
});

/**
 * Hook a pre save method to pre process data
 */
AppSchema.pre('save', function(next) {
	this.increment();
	let now = +moment.utc();

	if( this.isNew ) {
		this.created_time = now;
	}
	this.updated_time = now;

	next();
});


// create the model for users and expose it to our app
module.exports = mongoose.model('App', AppSchema, config.dbTablePrefix.concat("apps"));
