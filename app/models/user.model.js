//
//  Created by dientran on 2019-03-12.
//

// Load Module dependencies.
let path = require('path');
let moment = require('moment');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let utils = require('../helpers/utils');

let config = require(path.resolve('./config'));

// define the schema for our user model
let UserSchema = mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		lowercase: true,
		trim: true,
		index: {
			unique: true
		}
	},
	password: String,
	provider: {
		type: String,
		index: true
	},
	company_info:{
		name: String,
		address: String,
		country: String,
		province: String,
		city: String,
		time_zone: String,
	},
	contact_info:{
		first_name: String,
		last_name: String,
		phone: String,
		email: String
	},
	payment_info:{
		currency: String,
		card_number: String,
		expired: String,
		secret_code: String,
		post_code: String,
		country: String
	},
	balance: {
		type: Number,
		default: 0
	},
	usage: {
		type: Number,
		default: 0
	},
	picture: String,
	phone: String,
	address: String,
	status: String,
	created_time: {
		type: Number,
		index: true
	},
	updated_time: Number,
	security_hash: String,
	roles: Array
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	this.increment();
	let now = +moment.utc();

	if( this.isNew ) {
		this.created_time = now;
	}
	this.updated_time = now;
	if (this.password && this.isModified('password')) {
		this.password = this.generateHash(this.password);
	}

	if (this.payment_info && this.payment_info.secret_code && this.isModified('payment_info.password')) {
		this.payment_info.secret_code = utils.encrypt(this.payment_info.secret_code);
	}

	if (this.payment_info && this.payment_info.card_number && this.isModified('payment_info.card_number')) {
		this.payment_info.card_number = utils.encrypt(this.payment_info.card_number);
	}

	this.email = this.email.toLowerCase();
	next();
});


// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(16), null);
};

// checking if password is valid
UserSchema.methods.authenticate = function(password) {
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', UserSchema, config.dbTablePrefix.concat("users"));
