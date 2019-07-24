// Load Module dependencies.
let path = require('path');
let mongoose = require('mongoose');
let config = require(path.resolve('./config'));
let moment = require('moment');

// define the schema for our user model
let CitySchema = mongoose.Schema({
	_id: Number,
	name: String,
	state_id:{
		type: Number,
		ref: 'State'
	},
	created_time: Number,
	updated_time: Number
});

/**
 * Hook a pre save method to pre process data
 */
CitySchema.pre('save', function(next) {
	// this.increment();
	let now = +moment.utc();

	if( this.isNew ) {
		this.created_time = now;
	}
	this.updated_time = now;

	next();
});


// create the model for users and expose it to our app
module.exports = mongoose.model('City', CitySchema, config.dbTablePrefix.concat("cities"));
