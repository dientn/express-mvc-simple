let mongoose = require('mongoose');
let enums = require('../resources/enums/core.enums');

const PointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: [ enums.GeoTypes.Point ],
		required: true
	},
	coordinates: {
		type: [ Number ],
		required: true
	}
}, { _id : false });

const PolygonSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: [ enums.GeoTypes.Polygon ],
		required: true
	},
	coordinates: {
		type: [ [ [ Number ] ] ], // Array of arrays of arrays of numbers
		required: true
	}
}, { _id : false });

const LineSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: [ enums.GeoTypes.LineString ],
		required: true
	},
	coordinates: {
		type: [ [ Number ] ], // Array of arrays of arrays of numbers
		required: true
	}
}, { _id : false });

exports.PointSchema = PointSchema;
exports.PolygonSchema = PolygonSchema;
exports.LineSchema = LineSchema;

