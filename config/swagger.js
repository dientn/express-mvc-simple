'use strict';
let path = require('path');
let config = require('.');

let requireContext = require('require-context');
let files = requireContext(path.resolve('./swaggers/'), true, /\.js$/);
let isDev = process.env.NODE_ENV === 'development';

let swaggers = {
	"swagger": "2.0",
	"info": {
		"version": "1.0.0",
		"title": "Ligthbox Application API ",
		"description": "Ligthbox Application API",
		"license": {
			"name": "LB",
			"url": "https://opensource.org/licenses/MIT"
		}
	},
	"host": `${config.host}${isDev ? `:${ config.port}` : ''}`,
	"basePath": config.basePath,
	"schemes": [
		"http",
		"https"
	],
	"securityDefinitions": {
		JWT: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: "",
		}
	},
	"consumes": [
		"application/json",
		"multipart/form-data"
	],
	"produces": [
		"application/json"
	],
	"paths": {
	},
	"definitions": {
	}
};

files.keys().forEach(( file ) => {
	let mod = files(file);

	Object.assign(swaggers.paths, mod.paths);
	Object.assign(swaggers.definitions, mod.definitions);
});

module.exports = swaggers;
