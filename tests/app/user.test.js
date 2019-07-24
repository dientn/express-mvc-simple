'use strict';

// Require the dev-dependencies
let chai = require('chai');
let expect = chai.expect;
const mongoose = require('mongoose');
const config = require('../../config');
let userService = require('../../app/services/user');
let chaiHttp = require('chai-http');
const enums = require('../../app/resources/enums/core.enums');

chai.should();
chai.use(chaiHttp);
let request = chai.request(`http://${config.host}:${config.port}`).keepOpen();

// Our parent block
describe('User =============', () => {

	let user = {
		first_name: `Dien`,
		last_name: `Tran`,
		email: 'test-light@success-ss.com.vn',
		password: '12345678',
		confirmed_password: '12345678',
		status: 'active'
	};
	let token = '';

	before(async () => {
		/*
		Define clearDB function that will loop through all
		the collections in our mongoose connection and drop them.
		*/
		function clearDB() {
			mongoose.model('User').deleteMany(() => {});
			return Promise.resolve();
		}

		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.db.uri, config.db.options);
			return clearDB();

		} else {
			return clearDB();
		}
	});
	// run once after all tests
	after( (done) => {
		return done();
	});

	/*
     * Test the Register user
     */
	describe('/Register user', () => {

		it('it data should be success', (done) => {
			request.post('/api/v1/signup')
				.send(user)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('first_name').eq(user.first_name);
					expect(res.body).to.have.property('last_name').eq(user.last_name);
					expect(res.body).to.have.property('email').eq(user.email);
					return done();
				});
		});

		it('it should not post a user exists', (done) => {
			request.post('/api/v1/signup')
				.send(user)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors).to.have.property('single').include('Email already exists. Please use another email.');
					return done();
				});
		});

		it('it should without email field', (done) => {
			let _data = Object.assign( {}, user, { email: '' } );

			request.post('/api/v1/signup')
				.send(_data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors).to.have.property('email').be.a('array').that.include('Email is not a valid email');
					res.should.have.status(400);
					return done();
				});
		});

		it('it should be fail without password field', (done) => {
			let _data = Object.assign( {}, user, {
				email:'email-fail@success-ss.com',
				password: undefined,
				confirmed_password: undefined
			} );

			request.post('/api/v1/signup')
				.send(_data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors)
						.to.have.property('password')
						.be.a('array')
						.that.include('Password is required');

					return done();
				});
		});

		it('it should be fail with start spacing', (done) => {
			let _data = Object.assign( {}, user, {
				email:'email-fail@success-ss.com',
				password: ' 123456789',
				confirmed_password: ' 123456789'
			} );

			request.post('/api/v1/signup')
				.send(_data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors)
						.to.have.property('password')
						.be.a('array')
						.that.include('Password should not start or end with spacing character(s).');

					return done();
				});
		});

		it('it should be fail with confirm password does not match', (done) => {
			let _data = Object.assign( {}, user, { confirmed_password: '1234' } );

			request.post('/api/v1/signup')
				.send(_data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.body.should.be.a('object');
					res.should.have.status(400);
					expect(res.body).to.have.property('errors');
					expect(res.body.errors)
						.to.have.property('confirmed_password')
						.be.a('array')
						.that.include('Password and confirmation do not match.');

					return done();
				});
		});
	});


	/*
	 * Test the sign in user
	 */

	describe('/Sign in user', () => {

		it('update user should be success', (done) => {
			let query = {
				email :  user.email
			};
			userService.findOneAndUpdate(query,
				{
				security_hash: '',
				status: enums.UserStatus.Active
				}, (err, res) => {
					expect(err).to.be.null;
					expect(res).to.have.property('first_name').eq(user.first_name);
					expect(res).to.have.property('last_name').eq(user.last_name);
					expect(res).to.have.property('email').eq(user.email);
					return done();
			});
		});

		it('it data should be sign in success', (done) => {

			let data = {
				email: user.email,
				password: user.password,
			};

			request.post('/api/v1/signin')
				.send(data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body.user).to.have.property('first_name').eq(user.first_name);
					expect(res.body.user).to.have.property('last_name').eq(user.last_name);
					expect(res.body.user).to.have.property('email').eq(user.email);
					return done();
				});
		});

		it('it data should be fail without email', (done) => {
			let data = {
				password: '12345678'
			};

			request.post('/api/v1/signin')
				.send(data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors).to.have.property('single').eq('Signing in failed, please check your email and password');
					return done();
				});
		});

		it('it data should be fail without password', (done) => {
			let data = {
				email: 'dientran@success-ss.com.vn'
			};

			request.post('/api/v1/signin')
				.send(data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors).to.have.property('single').eq('Signing in failed, please check your email and password');
					return done();
				});
		});
	});

	/*
	 * Test the sign in user is admin
	 */

	describe('/Sign in admin user', () => {
		let adminUser = {
			roles: [
				enums.UserRoles.Admin
			],
			first_name: 'Admin',
			last_name: `Admin`,
			email: 'admin@success-ss.com.vn',
			password: '12345678',
			confirmed_password: '12345678',
			status: enums.UserStatus.Active
		}

		it('it add admin user data should be success', (done) => {

			userService.add(adminUser, (err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.property('first_name').eq(adminUser.first_name);
				expect(res).to.have.property('last_name').eq(adminUser.last_name);
				expect(res).to.have.property('email').eq(adminUser.email);
				return done();
			});
		});

		it('it data should be sign in success', (done) => {

			let data = {
				email: adminUser.email,
				password: adminUser.password,
			};

			request.post('/api/v1/admin-signin')
				.send(data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body.user).to.have.property('first_name').eq(adminUser.first_name);
					expect(res.body.user).to.have.property('last_name').eq(adminUser.last_name);
					expect(res.body.user).to.have.property('email').eq(adminUser.email);
					return done();
				});

		});

		it('it data should be fail with user is not a admin', (done) => {
			let data = {
				email: user.email,
				password: user.password,
			};

			request.post('/api/v1/admin-signin')
				.send(data)
				.end((err, res) => {
					expect(err).to.be.null;
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors');
					expect(res.body.errors).to.have.property('single').eq('Signing in failed, please check your email and password');
					return done();
				});
		});
	});

	/*
	 * Test get user
	 */

	describe('Get user', () => {
		it('get user by email should be success', (done) => {
			userService.getUserByEmail(user.email, (err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.property('first_name').eq(user.first_name);
				expect(res).to.have.property('last_name').eq(user.last_name);
				expect(res).to.have.property('email').eq(user.email);
				return done();
			});
		});

		it('get user by email should be fail', (done) => {
			userService.getUserByEmail('eee', (err, res) => {
				expect(err).to.be.null;
				expect(res).to.be.null;
				return done();
			});
		});
	});
});
