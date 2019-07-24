'use strict';

/**
 * @author: dientran
 * Module dependencies.
 */

let baseService = require('./base');

/**
 * list
 * author : dientran
 */
exports.listTimeZone = ( queries = {}, options, next) => {
	if(options.noLimit) {
		let sort = options.sort || '-created_time'; // "-created_time"
		let order = sort.substring(0, 1);
		let field = sort.substring(1);

		return baseService.find('TimeZone', queries, options.select, {
			sort: {
				[ field ]:  order === '+' ? +1 : -1
			}
		}, next);
	}

	return baseService.paginate('TimeZone', queries, options, next );
};

/**
 * list
 * author : dientran
 */
exports.listCountry = ( queries = {}, options, next) => {
	if(options.noLimit) {
		let sort = options.sort || '-created_time'; // "-created_time"
		let order = sort.substring(0, 1);
		let field = sort.substring(1);

		return baseService.find('Country', queries, options.select, {
			sort: {
				[ field ]:  order === '+' ? +1 : -1
			}
		}, next);
	}

	return baseService.paginate('Country', queries, options, next );
};


/**
 * list
 * author : dientran
 */
exports.listState = ( queries = {}, options, next) => {
	if(options.noLimit) {
		let sort = options.sort || '-created_time'; // "-created_time"
		let order = sort.substring(0, 1);
		let field = sort.substring(1);

		return baseService.find('State', queries, options.select, {
			sort: {
				[ field ]:  order === '+' ? +1 : -1
			}
		}, next);
	}

	return baseService.paginate('State', queries, options, next );

};

/**
 * list
 * author : dientran
 */
exports.listCity = ( queries = {}, options, next) => {
	if(options.noLimit) {
		let sort = options.sort || '-created_time'; // "-created_time"
		let order = sort.substring(0, 1);
		let field = sort.substring(1);

		return baseService.find('City', queries, options.select, {
			sort: {
				[ field ]:  order === '+' ? +1 : -1
			}
		}, next);
	}

	return baseService.paginate('City', queries, options, next );
};

