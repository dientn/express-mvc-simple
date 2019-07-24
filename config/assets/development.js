'use strict';

module.exports = {
	gulpConfig : 'gulpfile.js',
	allJS : [
		'app.js', 'config/**/*.js', 'app/*/**/*.js', 'lib/*.js', 'swaggers/**/*.js'
	],
	models : 'app/models/**/*.js',
	routes : 'app/routes/**/*.js',
	policies : 'app/policies/*.js',
};
