'use strict';

module.exports = {
	env: 'test',
	db : {
		uri : 'mongodb://127.0.0.1/lightbox_test',
		options : {
			user : 'lightbox_test',
			pass : 'lb123!@123',
			useCreateIndex: true,
			useNewUrlParser: true,
			useFindAndModify: false
		},
		debug : false
	},
	dbTablePrefix : 'lb_test_',
	environment: 'test',
	host: 'localhost',
	port : process.env.PORT || 8040,
	protocol: 'http',
	basePath: '/api/v1',
	// JWT Cookie settings
	jwt: {
		secret: process.env.JWT_SECRET || 'a877d5917122583475477b1c53ff20d4ce53',
		options: {
			expiresIn: '12h', // 1d
		},
		cookie: {
			httpOnly: true,
			signed: true,
			secure: false
		}
	},
	// Session Cookie settings
	sessionCookie : {
		// session expiration is set by default to 24 hours
		maxAge : 7 * 24 * (60 * 60 * 1000),
		// httpOnly flag makes sure the cookie is only accessed
		// through the HTTP protocol and not JS/browser
		httpOnly : true,
		// secure cookie should be turned to true to provide additional
		// layer of security so that the cookie is set only when working
		// in HTTPS mode.
		secure : false
	},
	// sessionSecret should be changed for security measures and concerns
	sessionSecret : process.env.SESSION_SECRET || 'LIGHTBOX',
	// sessionKey is set to the generic sessionId key used by PHP applications
	// for obsecurity reasons
	sessionKey : 'sessionId',
	sessionCollection : 'sessions',
	mailer : {
		from : "test@success-ss.com.vn",
		options : {
			host : "smtp.gmail.com",
			port : 465,
			secure : true,
			pool: true,
			maxConnections: 1,
			auth : {
				user : "test@success-ss.com.vn",
				pass : "Aa!@#123"
			}
		},
		admin : "test@success-ss.com.vn",
		errorlog : "test@success-ss.com.vn"
	}
};
