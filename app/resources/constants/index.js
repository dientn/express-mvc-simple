'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
	rContext = require('require-context');
    
let files = rContext(path.resolve('./app/resources/constants'), true, /^(?!index).*(\.js)$/);
let constants = {};

files.keys().forEach((constPath) => {
	constants = Object.assign(constants, files(constPath));
});

module.exports = constants;
