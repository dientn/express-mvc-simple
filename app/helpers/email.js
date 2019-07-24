'use strict';

let nodeMailer = require('nodemailer');
let config = require('../../config');
let path = require('path');
let ejs = require('ejs');
let constants = require('../resources/constants');
let transporter = nodeMailer.createTransport({
	service: 'gmail',
	auth: config.mailer.options.auth
});

// setup e-mail data with unicode symbols
let mailOptions = {
	from: `"${constants.APP_NAME}" <${config.mailer.from}>`, // sender address
};

exports.sendMail = ( options, next ) => {
	mailOptions = Object.assign(mailOptions, options.mailOptions);
	let data = options.data || {};

	if(!options.template) {

		mailOptions.html = mailOptions.html || '';
		// send mail with defined transport object
		return transporter.sendMail(mailOptions, (error) => {
			if (error) {
				next && next(error);
				return console.error(error);
			}

			next && next(error);
		});
	}

	let filename = path.resolve(`app/resources/templates/${options.template}`);

	ejs.renderFile(filename, data, {}, (err, email_data) => {
		if(err) {
			throw err;
		}

		mailOptions.html = email_data;

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error) => {
			if (error) {
				return console.log("Send mail error: ", error);
			}

			console.log('send  mail success');
			transporter.close();

		});

	});

};
