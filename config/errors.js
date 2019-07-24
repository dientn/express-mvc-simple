"use strict";

/**
 * Module dependencies.
 */
let path = require("path"),
	mailer = require("../app/helpers/email"),
	config = require("."),
	constants = require('../app/resources/constants'),
	mongoose = require("mongoose"),
	errorHandler = require(path.resolve("./app/helpers/errors"));

/**
 * override console.error and send mail when there are errors
 */
let overrideConsole = () => {
	console.error = (err, context, isNotOverride) => {
		// override error object
		if (!isNotOverride) {
			if (typeof err == "string") {
				err = new Error(err);
			} else if (typeof err == "object" && !err.stack) {
				err = new Error(
					err.toString() === "[object Object]"						? JSON.stringify(err)						: err.toString()
				);
			}
			let isUnique = errorHandler.getUniqueErrorMessage(err);
			// send a single error back

			if (err instanceof TypeError) {
				err.stack = JSON.stringify(errorHandler.getSingleMessage(err.message));
			}
			else if (err instanceof mongoose.Error.ValidationError) {
				err.stack = JSON.stringify(err.message);
			}

			// mongo unique error
			else if (isUnique instanceof Error) {
				err.stack = JSON.stringify({ [ isUnique.message ]: "Unique" });
			}
		}

		let data = {
			message: err.stack,
			context: context
		};
		let mailOptions = {
			to: config.mailer.errorlog,
			subject: "[lightbox-sys-error]"
		};
		// send mail for any system error

		mailer.sendMail({ template: constants.SYS_ERR_TEMPLATE, data, mailOptions });
		// print out to the console
		process.stderr.write(data.message);
	};
};

/**
 * Module init function.
 */
module.exports = () => {
	// override console.error
	overrideConsole();
};
