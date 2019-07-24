let crypto = require('crypto');
let bcrypt = require('bcrypt-nodejs');

exports.generateHash = (length) => {
	length = length || 24;
	let salt = bcrypt.genSaltSync(10);
	let hash = crypto.randomBytes(length).toString('hex').slice(0, length);

	return bcrypt.hashSync(hash, salt);
};

exports.generateToken = (length) => {
	length = length || 24;
	let hash = crypto.randomBytes(length).toString('hex');

	return hash;
};

const iv = Buffer.alloc(16, 0);

exports.encrypt = (text, password, algorithm) => {
	try {
		algorithm = algorithm || 'aes-256-ctr';
		let key = Buffer.alloc(32, password, 'base64');
		let cipher = crypto.createCipheriv(algorithm, key, iv);
		let en = cipher.update(text, 'utf8', 'hex');

		en += cipher.final('hex');
		return en;
	} catch (ex) {
		console.error(ex);
		return text;
	}
};

exports.decrypt = (text, password, algorithm) => {
	try {
		algorithm = algorithm || 'aes-256-ctr';
		let key = Buffer.alloc(32, password, 'base64');
		let decipher = crypto.createDecipheriv(algorithm, key, iv);
		let dec = decipher.update(text, 'hex', 'utf8');

		dec += decipher.final('utf8');
		return dec;
	} catch(ex) {
		console.error(ex);
		return text;
	}
};
