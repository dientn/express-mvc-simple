'use strict';

module.exports = {
	env: 'development',
	// db: {
	// 	uri : 'mongodb://127.0.0.1/express_dev',
	// 	options : {
	// 		user : 'express_dev',
	// 		pass : 'xp23!@123',
	// 		useNewUrlParser: true,
	// 		useCreateIndex: true,
	// 		useFindAndModify: false
	// 	},
	// 	debug : false
	// },
	db: {
		uri : 'mongodb://127.0.0.1/lightbox_dev',
		options : {
			user : 'lightbox_dev',
			pass : 'lb123!@123',
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		},
		debug : false
	},
	dbTablePrefix : 'xp_dev_',
	environment: 'dev',
	host: 'localhost',
	port : process.env.PORT || 8001,
	protocol: 'http',
	basePath: '/api/v1',
	appSecret: "a877d5917122583475477b1c53ff20d4ce53",
	// Session Cookie settings
	sessionCookie : {
		// session expiration is set by default to 24 hours
		maxAge : 7 * 24 * ( 60 * 60 * 1000 ),
		// httpOnly flag makes sure the cookie is only accessed
		// through the HTTP protocol and not JS/browser
		httpOnly : true,
		// secure cookie should be turned to true to provide additional
		// layer of security so that the cookie is set only when working
		// in HTTPS mode.
		secure : false
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'EXPRESS-MVC',
		options: {
			expiresIn: '7d', // 1d
		},
		cookie: {
			// session expiration is set by default to 24h
			maxAge : 7 * 24 * ( 60 * 60 * 1000 ), // 7d
			httpOnly: true,
			secure: false
		}
	},
	// sessionSecret should be changed for security measures and concerns
	sessionSecret : process.env.SESSION_SECRET || 'EXPRESS-MVC',
	// sessionKey is set to the generic sessionId key used by PHP applications
	// for obsecurity reasons
	sessionKey : 'sessionId',
	sessionCollection : 'sessions',
	mailer : {
		from : "express-mvc@gmail.com",
		options : {
			host : "smtp.gmail.com",
			port : 465,
			secure : true,
			pool: true,
			maxConnections: 1,
			auth : {
				user : "express-mvc@gmail.com",
				pass : "email-pass"
			}
		},
		admin : "express-mvc@gmail.com",
		error_log : "express-mvc@gmail.com"
	},
	pagination:{
		perPage: 10
	}
};
