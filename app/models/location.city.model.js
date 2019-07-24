// Load Module dependencies.
let path = require('path');
let mongoose = require('mongoose');
let config = require(path.resolve('./config'));
let moment = require('moment');
let GeoSchema = require('./geo.schema');

// define the schema for our user model
let CitySchema = new mongoose.Schema({
	name: String,
	osm_id: Number,
	sub_level: Number,
	central: GeoSchema.PointSchema,
	geometry: GeoSchema.PolygonSchema,
	created_time: Number,
	updated_time: Number,
});

CitySchema.index({ geometry: '2dsphere' });

/**
 * Hook a pre save method to pre process data
 */
CitySchema.pre('save', function(next) {
	this.increment();
	let now = +moment.utc();

	if( this.isNew ) {
		this.created_time = now;
	}
	this.updated_time = now;

	next();
});


// create the model for users and expose it to our app
module.exports = mongoose.model('LocationCity', CitySchema, config.dbTablePrefix.concat("location_cities"));
