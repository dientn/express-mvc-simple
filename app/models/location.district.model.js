// Load Module dependencies.
let path = require('path');
let mongoose = require('mongoose');
let config = require(path.resolve('./config'));
let moment = require('moment');
let GeoSchema = require('./geo.schema');

// define the schema for our user model
let DistrictSchema = mongoose.Schema({

	city_id: {
		type: mongoose.Types.ObjectId,
		ref: 'LocationCity'
	},
	name: {
		type: String,
		index: true
	},
	osm_id: Number,
	central: GeoSchema.PointSchema,
	geometry: GeoSchema.PolygonSchema,
	created_time: {
		type: Number,
		index: true
	},
	updated_time: Number
});

DistrictSchema.index({ geometry: '2dsphere' });

/**
 * Hook a pre save method to pre process data
 */
DistrictSchema.pre('save', function(next) {
	this.increment();
	let now = +moment.utc();

	if( this.isNew ) {
		this.created_time = now;
	}
	this.updated_time = now;

	next();
});


// create the model for users and expose it to our app
module.exports = mongoose.model('LocationDistrict', DistrictSchema, config.dbTablePrefix.concat("location_districts"));
