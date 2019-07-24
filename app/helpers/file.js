'use strict';
//
//  file.js
//  define file js
//
//


/**
 * Module dependencies.
 */
let _ = require('lodash'),
	path = require('path'),
	config = require(path.resolve('./config')),
	fs = require('fs-extra');

let move = (src, dest) => {
	return new Promise((resolve, reject) => {
		// if file existed
		if (fs.existsSync(dest)) {
			// remove then move new file to
			fs.remove(dest, (err) => {
				if (err) {
					return reject(err);
				}
				fs.move(src, dest, (errMove) => {
					if (errMove) {
						return reject(errMove);
					}
					resolve(dest);
				});
			});
		} else {
			// file not existed, only move file to
			fs.move(src, dest, { overwrite: true }, (err) => {
				if (err) {
					return reject(err);
				}
				resolve(dest);
			});
		}
	});
};
/**
 * move files from the uploaded tmp folder to dest folder
 * author : dientn
 */

exports.removeFile = (file_path, callback) => {
	if (fs.existsSync(file_path)) {
		// remove then move new file to
		fs.remove(file_path, (err) => {
			if (err) {
				return callback(err);
			}

			callback();
		});
	} else {
		callback();
	}
};

/**
 * move files from the uploaded tmp folder to dest folder
 * author : dientn
 */
exports.moveFile = (id, files, dest_path, next) => {
	let tasks = [],
		filePath = `${config.upload.path}${id}/${dest_path || ''}`;

	fs.ensureDirSync(filePath);

	_.forEach(files, (file) => {
		if (_.isArray(file)) {
			_.forEach(file, (f) => {
				let file_name = f.filename;
				let tmp_file = f.path;
				let media_file = `${filePath}/${file_name}`;

				tasks.push(move(tmp_file, media_file));
			});
		} else {
			let file_name = file.filename;
			let tmp_file = file.path;
			let media_file = `${filePath}/${file_name}`;

			tasks.push(move(tmp_file, media_file));
		}

	});

	Promise.all(tasks).then(() => {
		next && next();
	}, (reason) => {
		console.log(reason);
		next && next(reason);
	});
};

/*
 * Create file pdf
 * @author: dientn
 * @param options:
        {   path_template :path of template file (require),
            user_id : parent user id (require),
            folder_zip : folder name of folder of zip file (if zip pdf file),
            data: data to render with SWIG (require),
            file_name : file name (require),
            pdfFile : if out put by file path
            res : for streaming
        }
 * @callbaclk :
            err : if error,
            result : stream(res) if streaming(exists options.res)
                     fileinfo if file out put
 */
// exports.createPDFFile = function(options, callback) {
// 	if (!fs.existsSync(options.path_template)) {
// 		return callback(new TypeError("Not found template"), null);
// 	}
// 	let tpl = swig.compileFile(options.path_template);
// 	let userReportFolder = `${config.upload.path}${options.user_id}`;
// 	let html = tpl(options.data);

// 	let options_pdf = {
// 		orientation: options.orientation || "landscape", // portrait
// 		pageSize: options.page_size || "letter", // A4, Letter, etc.
// 	};
// 	let pdfFile = options.pdfFile ? options.pdfFile : `${userReportFolder}/${options.file_name}.pdf`;

// 	let stream = options.res || fs.createWriteStream(pdfFile);

// 	let result = options.res ? stream : {
// 		path: pdfFile,
// 		filename: path.basename(pdfFile)
// 	};

// 	stream.on('error', (err) => {
// 		stream.end();
// 		callback(err);
// 	});

// 	stream.on('finish', () => {
// 		callback(null, result);
// 	});

// 	PDFKit(html, options_pdf).pipe(stream);

// };


/**
 * move files from_path, to_path
 * author : dientran
 * files : { filename : string }
 * onError : function called whenever error created
 */
exports.moveFilesWithPath = (files, str_path, des_path, onError, done) => {
	let tasks = [];

	if (!files.length) {
		return done && done();
	}

	files.forEach((file) => {
		let file_str_path = `${str_path.replace(/\/+$/, "")}/${file.name || file.filename}`,
			file_des_path = `${des_path.replace(/\/+$/, "")}/${file.newname || file.name || file.filename}`;

		tasks.push(new Promise((resolve) => {

			function next(err) {
				if (err && onError) {
					onError({
						error: err,
						str_path: file_str_path,
						des_path: file_des_path
					});
				}
				resolve();
			}

			fs.move(file_str_path, file_des_path, { overwrite: true, clobber: true }, next);
		}));
	});

	Promise.all(tasks).then(() => {
		done && done();
	});
};


/**
 * copy files from_path, to_path
 * author : dientran
 * files : { filename : string }
 * onError : function called whenever error created
 */
exports.copyFilesWithPath = (files, str_path, des_path, onError, done) => {
	let tasks = [];

	if (!files.length) {
		if (done) {
			done();
		}
		return;
	}


	files.forEach((file) => {
		let file_str_path = `${str_path.replace(/\/+$/, "")}/${file.name || file.filename}`,
			file_des_path = `${des_path.replace(/\/+$/, "")}/${file.newname || file.name || file.filename}`;

		tasks.push(new Promise((resolve) => {
			fs.mkdirs(des_path, (_err) => {
				console.log(_err);
				fs.copy(file_str_path, file_des_path, { replace: true }, (errCopy) => {
					if (errCopy && onError) {
						onError({
							error: errCopy,
							str_path: file_str_path,
							des_path: file_des_path
						});
					}
					resolve();
				});
			});
		}));
	});

	Promise.all(tasks).then(() => {
		if (done) {
			done();
		}
	});
};
