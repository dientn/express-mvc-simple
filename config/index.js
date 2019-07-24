/* eslint-disable space-before-function-paren */
'use strict';

/**
 * Module dependencies.
 */
let _ = require( 'lodash' ),
	chalk = require( 'chalk' ),
	glob = require( 'glob' ),
	fs = require( 'fs' ),
	path = require( 'path' ),

	/**
     * Get files by glob patterns
     */
	getGlobbedPaths = ( globPatterns, excludes ) => {
		// URL paths regex
		let urlRegex = new RegExp( '^(?:[a-z]+:)?\/\/', 'i' ),

			// The output array
			output = [];

		// If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
		if ( _.isArray( globPatterns ) ) {
			globPatterns.forEach( ( globPattern ) => {
				output = _.union( output, getGlobbedPaths( globPattern, excludes ) );
			} );
		} else if ( _.isString( globPatterns ) ) {
			if ( urlRegex.test( globPatterns ) ) {
				output.push( globPatterns );
			} else {
				let files = glob.sync( globPatterns );

				if ( excludes ) {
					files = files.map( ( file ) => {
						if ( _.isArray( excludes ) ) {
							for ( let i in excludes ) {
								file = file.replace( excludes[ i ], '' );
							}
						} else {
							file = file.replace( excludes, '' );
						}
						return file;
					} );
				}
				output = _.union( output, files );
			}
		}

		return output;
	},

	/**
     * Validate NODE_ENV existence
     */
	validateEnvironmentVariable = () => {
		let environmentFiles = glob.sync( `./config/env/${ process.env.NODE_ENV }.js` );

		if ( !environmentFiles.length ) {
			if ( process.env.NODE_ENV ) {
				console.error( chalk.red( `+ Error: No configuration file found for "${ process.env.NODE_ENV }" environment using development instead` ) );
			} else {
				console.error( chalk.red( '+ Error: NODE_ENV is not defined! Using default development environment' ) );
			}
			process.env.NODE_ENV = 'development';
		}
		// Reset console color
		console.log( chalk.white( '' ) );
	},

	/**
     * Validate Session Secret parameter is not set to default in production
     */
	validateSessionSecret = ( config, testing ) => {

		if ( process.env.NODE_ENV !== 'production' ) {
			return true;
		}

		if ( config.sessionSecret === 'LIGHTBOX' ) {
			if ( !testing ) {
				console.log( chalk.red( '+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!' ) );
				console.log( chalk.red( '  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to ' ) );
				console.log( chalk.red( '  `config/env/production.js` or `config/env/local.js`' ) );
				console.log();
			}
			return false;
		}
		return true;
    
	},

	/**
     * Initialize global configuration
     */
	initConfig = () => {
		// Validate NODE_ENV existence
		validateEnvironmentVariable();

		// Get the default assets
		// let defaultAssets = require( path.join( process.cwd(), 'config/assets/default' ) ),

		// Get the current assets
		// environmentAssets = require( path.join( process.cwd(), 'config/assets/', process.env.NODE_ENV ) ) || {},
		// Merge assets
		// assets = _.merge( defaultAssets, environmentAssets );

		// Get the default config
		let defaultConfig = require( path.join( process.cwd(), 'config/env/default' ) ),

			// Get the current config
			environmentConfig = require( path.join( process.cwd(), 'config/env/', process.env.NODE_ENV ) ) || {},

			// Merge config files
			config = _.merge( defaultConfig, environmentConfig );

		// We only extend the config object with the local.js custom/local environment if we are on
		// production or development environment. If test environment is used we don't merge it with local.js
		// to avoid running test suites on a prod/dev environment (which delete records and make modifications)
		if ( process.env.NODE_ENV !== 'test' ) {
			config = _.merge( config, ( fs.existsSync( path.join( process.cwd(), 'config/env/local.js' ) ) && require( path.join( process.cwd(), 'config/env/local.js' ) ) ) || {} );
		}

		// Validate session secret
		validateSessionSecret( config );

		// Expose configuration utilities
		config.utils = {
			getGlobbedPaths: getGlobbedPaths,
			validateSessionSecret: validateSessionSecret
		};

		return config;
	};

/**
 * Set configuration object
 */
module.exports = initConfig();
