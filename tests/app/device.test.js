'use strict';

// Require the dev-dependencies
let chai = require('chai');
let expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../../config');
const deviceService = require('../../app/services/app');
const enums = require('../../app/resources/enums/core.enums');
let Device = require('../../app/models/app.model');

chai.should();


// Our parent block
describe('Devices =============', () => {

	let device = {
		"client_id":"1234578912345678791313",
		"secret":"123456789",
		"location":{
			"coordinates":[106.7017555,10.7758439],
			"type":"Point"
		},
		"is_active":true
	};

	let client = null;

	before(async () => {
		/*
		Define clearDB function that will loop through all
		the collections in our mongoose connection and drop them.
		*/
		function clearDB() {
			Device.deleteMany(() => {});
			return Promise.resolve();

		}


		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.db.uri, config.db.options);
		}

		return clearDB();

	});
	// run once after all tests
	after( (done) => {
		return done();
	});


	/*
	 * Test the ad
	 */
	describe('/Add device', () => {

		it('it add data should be success', (done) => {
			deviceService.add(device, (err, res) =>{
				expect(err).to.be.null;
				expect(res).should.be.a('object');
				expect(res).to.have.property('name').eq(device.name);
				expect(res).to.have.property('secret').eq(device.secret);
				expect(res).to.have.property('is_active').eq(device.is_active);
				device = res;
				return done();
			});
		});
	});

	/*
	 * Test the get available devices
	 */
	describe('/Get Available Devices', () => {

		it('it data should be success', (done) => {
			deviceService.findAvailable((err, res) =>{
				expect(err).to.be.null;
				res.should.be.a('array');
				expect(res).to.have.property('length').eq(1);
				return done();
			})
		});
	});
});
