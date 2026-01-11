'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = process.env.JWT_SECRET || 'covfefe';

/**
 * Crea un token JWT para un usuario
 * @param {Object} user - Usuario
 * @returns {string} Token JWT
 */
function createToken(user) {
	const payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		routes: user.routes,
		image: user.image,
		company: user.company,
		iat: moment().unix(),
		// Opcional: agregar expiración
		// exp: moment().add(2, 'days').unix(),
	};
	
	return jwt.sign(payload, secret, {
		// algorithm: 'HS256' // Por defecto
	});
}

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido
 */
function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, secret);
		return decoded;
	} catch (err) {
		throw new Error('Token inválido o expirado');
	}
}

module.exports = {
	createToken,
	verifyToken,
};
