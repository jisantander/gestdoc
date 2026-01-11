'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = process.env.JWT_SECRET || 'covfefe';

function createToken(user) {
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		routes: user.routes,
		image: user.image,
		company: user.company,
		iat: moment().unix(),
		//exp: moment().add(2, 'days').unix(),
	};
	return jwt.encode(payload, secret);
}

function verifyToken(token) {
	const data = jwt.decode(token, secret);
	return data;
}

module.exports = {
	createToken,
	verifyToken,
};
