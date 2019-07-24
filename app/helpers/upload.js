'use strict';
//
//  upload.js
//  handle the upload files
//
//

/**
 * Module dependencies.
 */
let path = require('path'),
	config = require(path.resolve('./config')),
	fs = require('fs'),
	_ = require('lodash'),
	constants = require('../resources/constants'),
	multer = require('multer');

/**
 * define disk storage
 */
let diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		let tmp_path = config.upload.tmp_path;

		if (!fs.existsSync(tmp_path)) {
			fs.mkdirSync(tmp_path);
		}
		cb(null, tmp_path);
	},
	filename: (req, file, cb) => {
		let rand_name = Date.now();
		let name = `${file.fieldname}_${rand_name}.${file.originalname.split('.').pop()}`;

		cb(null, name);
	}
});
let memoryStorage = multer.memoryStorage();

/**
 * apply fil filter for uploading files
 */
let fileFilter = (req, file, options, cb) => {
	// if not expected mimetype, reject
	if (!options.mimetype || options.mimetype.indexOf(file.mimetype) === -1) {
		return cb(new TypeError(constants.file_upload_extension));
	}
	cb(null, true);
};

/**
 * handle upload files
 * params options :
          options.mimetype // extension of file
          options.single // if upload single file
          options.array // if upload more than 1 file in 1 name
          options.fields // if multifile by field name
          options.fileSize // max uploaded file
          options.storage // storage type (memory disk)
    ex:
    {
        mimetype : "image/jpeg image/png image/gif",
        fields: [
            {name: "logo", maxCount: 1},
            {name: "favicon", maxCount: 1}
        ]
    }
 */
module.exports = (options) => {
	// init multer
	let upload = multer({
		storage: options.storage === "memory" ? memoryStorage : diskStorage,
		fileFilter: (req, file, cb) => {
			fileFilter(req, file, options, cb);
		},
		limits: {
			fileSize: options.fileSize || config.upload.size
		}
	});

	let cpUpload = null;
	// detect option data

	if (options.single) {
		cpUpload = upload.single(options.single);
	} else if (options.array) {
		cpUpload = upload.array(options.array.fieldname, options.array.maxCount);
	} else if (options.fields) {
		cpUpload = upload.fields(options.fields);
	}

	return (req, res, next) => {
		if(!cpUpload) {
			return next(new TypeError(constants.field_not_found));
		}
		// catch errors specifically from multer
		cpUpload(req, res, (err) => {
			if (err) {
				return next(new TypeError(constants.upload_fail));
			}
			if(options.storage !== "memory") {
				_.forEach(req.files, (file, key) => {
					if(_.isArray(file)) {
						let array_file = [];

						_.forEach(file, (f) => {
							f.extension = f.filename.split('.').pop();
							f.uploadfilename = `${f.fieldname}.${f.extension}`;
							array_file.push(f);

						});
						req.files[ key ] = array_file;
					}else{
						file = _.isArray(file) ? file[ 0 ] : file;
						file.extension = file.filename.split('.').pop();
						file.uploadfilename = `${file.fieldname}.${file.extension}`;
						req.files[ key ] = file;
					}

				});
				if(req.file) {
					req.file.extension = req.file.filename.split('.').pop();
					req.file.uploadfilename = `${req.file.fieldname}.${req.file.extension}`;
				}
			}
			return next();
		});
	};
};
