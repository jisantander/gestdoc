'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = process.env.JWT_SECRET || 'covfefe';

/**
 * Middleware de autenticación JWT
 */
exports.ensureAuth = function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).send({ message: 'Sin cabecera de autenticación!' });
	}

	const token = req.headers.authorization.replace(/['"]+/g, '');

	try {
		const payload = jwt.verify(token, secret);

		// Verificar expiración si existe
		if (payload.exp && payload.exp <= moment().unix()) {
			return res.status(401).send({ message: 'Token expiró' });
		}

		req.user = payload;
		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).send({ message: 'Token expiró' });
		}
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).send({ message: 'Token inválido' });
		}
		return res.status(500).send({ message: 'Error al verificar token' });
	}
};
