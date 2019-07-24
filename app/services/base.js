
let mongoose = require('mongoose');
let config = require('../../config');

let countFn = (Model, queries = {}, callback) => {
	Model.countDocuments(queries).exec((err, total) => {
		if(err) {
			return callback(err);
		}
		callback(null, total);
	});
};

/*
* get pagination data
* @author: dientran
* @params
*	modelName : string name of model
*	queries: object query conditions
* 	options: object of query option { limit, sort, page select }
*	callback : callback function
*/
exports.paginate = (modelName = '', queries = {}, options, callback ) => {
	let Model = mongoose.model(modelName);

	let limit = options.limit || config.pagination.perPage;
	let page = options.page || 1;
	let sort = options.sort || '-created_time'; // "-created_time"
	let select = options.select;
	let populate = options.populate;
	let order = sort.substring(0, 1);
	let field = sort.substring(1);
	let query = Model.find(queries);

	limit = parseInt(limit);
	page = parseInt(page);

	let skip = limit * (page === 0 ? page : page - 1 );

	query.limit(limit).skip(skip);

	if(select) {
		query = query.select(select);
	}

	if(populate) {
		query = query.populate(populate);
	}

	let counter = new Promise((resolve, reject) => {
		countFn(Model, queries, (err, count) => {
			if(err) {
				return reject(err);
			}
			resolve(count);
		});
	});


	let selector = new Promise((resolve, reject) => {
		query.sort({ [ field ]:  order === '+' ? +1 : -1 })
			.exec((err, results) => {
				if(err) {
					return reject(err);
				}
				resolve(results);
			});
	});

	Promise.all([
		counter,
		selector
	]).then((results) => {
		let count = results[ 0 ];
		let data = results[ 1 ];

		return callback(null, {
			data: data,
			page: page,
			pages: Math.ceil(count / limit),
			total: count
		});
	}).catch((err) => {
		return callback(err);
	});
};

exports.count = (modelName = '', queries = {}, callback ) => {
	let Model = mongoose.model(modelName);

	countFn(Model, queries, (err, count) => {
		if(err) {
			return callback(err);
		}
		callback(null, count);
	});
};

exports.find = (modelName, query, projection = null, options, next) => {
	/**
	 * Model already register in each model
	 */

	let Model = mongoose.model(modelName);

	query = query || {};
	options = options || {};
	Model.find(query, projection, options).exec(next);
};

exports.findOneAndUpdate = (modelName, query, update, options, next) => {
	/**
	 * Model already register in each model
	 */

	let Model = mongoose.model(modelName);

	query = query || {};
	update = update || {};
	options = options || {};
	Model.findOneAndUpdate(query, update, options).exec(next);
};

exports.findByIdAndUpdate = (modelName, id, update, options, next) => {
	let Model = mongoose.model(modelName);

	// check the validity of id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return next(new TypeError("Id invalid"));
	}

	update = update || {};
	options = options || {};

	Model.findByIdAndUpdate(id, update, options).exec(next);
};

exports.findById = (modelName, id, next) => {
	let Model = mongoose.model(modelName);

	Model.findById(id, next);
};

exports.findOne = (modelName, query = {}, next) => {
	let Model = mongoose.model(modelName);

	Model.findOne(query, next);
};

exports.findByIdAndRemove = (modelName, id, options, next) => {
	let Model = mongoose.model(modelName);

	Model.findByIdAndRemove(id, options).exec(next);
};

exports.findOneAndRemove = (modelName, query, options = {}, next) => {
	let Model = mongoose.model(modelName);

	Model.findByIdAndRemove(query, options).exec(next);
};

exports.findAndRemove = (modelName, query, next) => {
	let Model = mongoose.model(modelName);

	Model.remove(query).exec(next);
};

exports.query = (modelName, query) => {
	let Model = mongoose.model(modelName);

	query = query || {};
	return Model.find(query);
}
