'use strict';

/**
 * Module dependencies.
 */
let config = require('..'),
	chalk = require('chalk'),
	path = require('path'),
	rContext = require('require-context'),
	mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function(callback) {
	// Globbing model files
	let files = rContext(path.resolve('./app/models'), true, /model\.js$/);

	files.keys().forEach( (modelPath) => {
		files(modelPath);
	});

	if (callback) {
		callback();
	}
};


// Load the mongoose models
module.exports.emptyDb = function(callback) {
	// Globbing model files
	let files = rContext(path.resolve('./app/models'), true, /\.js$/);

	files.keys().forEach( (modelPath) => {
		files(modelPath).remove();
	});

	if (callback) {
		callback();
	}
};
// Initialize Mongoose
module.exports.connect = (callback) => {
	mongoose.set('useFindAndModify', false);
	mongoose.connect(config.db.uri, config.db.options);

	let db = mongoose.connection;

	db.on('error', (err) => {
		if (err) {
			console.error(chalk.red('Could not connect to MongoDB!'));
			console.log(err);
		} else if(config.db.debug) {
			// Enabling mongoose debug mode if required
			mongoose.set('debug', (collectionName, method, query, doc) => {
				console.log(`Mongoose: ${collectionName}.${method}; Query: ${JSON.stringify(query, null, 2)}; Doc: ${JSON.stringify(doc, null, 2)}`);
			});
		} else {
			mongoose.set('debug', false);
		}

	});
	mongoose.connection.on('connected', () => {
		console.log(chalk.green('Connected to MongoDB '));
		if(callback) {
			callback();
		}
	});

	return db;
};

module.exports.disconnect = function(cb) {
	mongoose.disconnect((err) => {
		console.info(chalk.yellow('Disconnected from MongoDB.'));
		cb(err);
	});
};
