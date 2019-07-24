
'use strict';

let mongoose = require('mongoose');


module.exports = (validate) => {

	/*
	*  check is objectId
	*  @author: dientn
	*/
	validate.validators.isObjectId = (value, options) => {
		if( !value ) {
			return null;
		}
		return validate.Promise(( resolve) => {
			// check the value is array
			if ( !mongoose.Types.ObjectId.isValid( value ) ) {
				return resolve( options.message );
			}
			return resolve();
		} );
	};

	/*
	*  check is array
	*  @author: dientran
	*/
	validate.validators.is_array = (value, options) => {
		if(!value) {
			return null;
		}
		return validate.Promise(( resolve ) => {
			// check the value is array
			if (!Array.isArray(value)) {
				return resolve( options.message );
			}
			return resolve();
		} );
	};

	/*
	*  check whether array of values contains another array of values
	*  @author: dientran
	*/
	validate.validators.isBoolean = (value, options, key, attributes) => {
		return validate.Promise(( resolve ) => {
			if( _.keys(attributes).indexOf(key) === -1) {
				return resolve();
			}
			// check the value is array
			if (!validate.isBoolean(value)) {
				return resolve( options.message );
			}
			return resolve();
		} );
	};

	/*
	*  check whether array of values contains another array of values
	*  @author: dientran
	*/
	validate.validators.inclusionArray = (values, options) => {
		return validate.Promise(( resolve ) => {
			if (!Array.isArray(values)) {
				return resolve( options.message );
			}

			let found = values.some( value => options.within.indexOf(value) !== -1 );

			if(!found) {
				return resolve(options.message);
			}
			return resolve();
		} );
	};
};
