'use strict';

/**
 * Module dependencies.
 */
let _ = require('lodash'),
	defaultAssets = require('./config/assets/default'),
	testAssets = require('./config/assets/test'),
	gulp = require('gulp'),
	mocha = require('gulp-mocha'),
	gulpeach = require('gulp-foreach'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	mongoose = require('mongoose'),
	plugins = gulpLoadPlugins();

// Set NODE_ENV to 'test'
gulp.task('env:test', (done) => {
	process.env.NODE_ENV = 'test';
	return done();
});

// Set NODE_ENV to 'test'
gulp.task('env:test:dev', (done) => {
	process.env.NODE_ENV = 'test';
	process.env.DEV_ENV = true;
	return done();
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', (done) => {
	process.env.NODE_ENV = 'development';
	return done();
});

// SET NODE_ENV to 'staging'
gulp.task('env:stag', () => {
	process.env.NODE_ENV = 'staging';
	return done();
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', () => {
	process.env.NODE_ENV = 'production';
	return done();
});

// Nodemon task
gulp.task('nodemon', (done) => {
	let started = false;

	let stream = plugins.nodemon({
		script: 'app.js',
		// nodeArgs: ['--debug'],
		ext: 'js',
		watch: _.union(defaultAssets.allJS)
	});

	if(process.env.NODE_ENV === 'test') {
		stream.on('start', () => {
			if(!started) {
				return done();
			}
				
			started = true;
		}).on( (err) => {
			done(err);
			return process.exit();
		});
	}
	
	return stream;
});

// Watch Files For Changes
gulp.task('watch', (done) => {
	plugins.livereload.listen();

	// Add watch rules
	gulp.watch(defaultAssets.allJS).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.gulpConfig);
	return done();
});

// Mocha tests task
gulp.task('mocha', (done) => {
	// Run the tests
	let mochaOpts = {
		opts: "./tests/mocha.opts",
		// reporter: 'spec',
		reporter: 'mocha-junit-reporter',
		reporterOptions: {
			mochaFile: './tests/junit-report.xml'
		},
		timeout: 50000,
		exit: true
	};

	if(process.env.DEV_ENV) {
		mochaOpts.reporter = 'spec';
		mochaOpts.reporterOptions = undefined;
	}

	gulp.src(testAssets.tests.server)
		.pipe(gulpeach((stream) => {
			return stream
				.pipe(mocha(mochaOpts))
				.on('error', (err) => {
					console.error(err);
				});
		})).on('finish', () => {
			console.log('Tests completed ================');
			done();
			return process.exit();
		});
});

gulp.task('watch-test', (done) => {
	gulp.watch(testAssets.tests.server, gulp.series([ 'mocha' ]));
	return done();
});

gulp.task('load-database',async (done) => {
	let database = require( './config/lib/database' );

	/*
		Define clearDB function that will loop through all
		the collections in our mongoose connection and drop them.
	*/
	let clearDB = () => {
		for (let i in mongoose.connection.collections) {
			mongoose.connection.collections[ i ].remove(() => {});
		}
		return done();
	};

	if (mongoose.connection.readyState === 0) {
		let config = require('./config');
		await mongoose.connect(config.db.uri, config.db.options);
	} 

	database.loadModels();
	console.log("Load database success =========");

	return done();
	
});

gulp.task('clear-db-test', (done) => {
	let database = require( './config/lib/database' );

	/*
		Define clearDB function that will loop through all
		the collections in our mongoose connection and drop them.
	*/
	let clearDB = () => {
		for (let i in mongoose.connection.collections) {
			mongoose.connection.collections[ i ].remove(() => {});
		}
		return done();
	};

	if(mongoose.connection.open) {
		database.loadModels();
		clearDB();
		return done();
	}
	let config = require('./config');

	mongoose.connect(config.db.uri, config.db.options);
	// Initialize Models
	
	mongoose.connection.once('connected', () => {
		
		// database.emptyDb();
		database.loadModels();
		
		console.log("Db connected =========");
		clearDB();
		return done();
	});
});

// Run the project tests
gulp.task('test', gulp.series([ 'env:test', 'nodemon' ], [ 'mocha' ]));

// Run the project tests on server
gulp.task('test:dev', gulp.series([ 'env:test:dev', 'nodemon', 'load-database' ], [ 'mocha' ]));

// Run the project in development mode
gulp.task('default', gulp.series([ 'env:dev', 'nodemon' ], [ 'watch' ]));

// Run the project in debug mode
gulp.task('debug', gulp.series('env:dev', [ 'nodemon', 'watch' ]));

// Run the project in staging mode
gulp.task('stag', gulp.series('env:stag', [ 'nodemon', 'watch' ]));

// Run the project in production mode
gulp.task('prod', gulp.series('env:prod', [ 'nodemon', 'watch' ]));
