'use strict';

var express = require('express');
var UserController = require('../controllers/userController');
const UsersController = require('../controllers/usersController');
var md_auth = require('../middlewares/authenticate');
const { verifyPassword } = require('../models/userModel');

var api = express.Router();

var multipart = require('connect-multiparty');
const { filter } = require('jszip/lib/object');

var jwt = require('../services/jwt');

var md_upload = multipart({ uploadDir: './uploads/users' });

api.post('/user', UserController.saveUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/user/image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/user/image/:imageFile', UserController.getImageFile);

api.post('/login', UserController.loginUser);

api.post('/verify', UserController.verifyUser);
api.post('/google_auth', UserController.google_auth);
api.post('/password-reset', UserController.passwordResetRequest);
api.get('/password-reset/:token', UserController.passwordResetCheckToken);
api.post('/password-reset/:token', UserController.passwordResetDo);

api.get('/sendmail', UserController.sendProcessDone);

/*
 * GET
 */
api.get('/users', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let filter = req.query.filter ? req.query.filter : req.user.company ? { company: req.user.company } : {};

		if (typeof filter === 'string') {
			filter = JSON.parse(filter);
			if (filter.name) {
				const value = filter.name;
				filter = {
					$or: [{ name: { $regex: value, $options: 'i' } }, { email: { $regex: value, $options: 'i' } }]
				};
			}
		}
		const users = await UsersController.find({
			filter,
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit)
		});
		res.json(users);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});
api.get('/users/all', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		const users = await UsersController.showAll(filter);
		res.json(users);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});
api.get('/users/companies', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const companies = await UsersController.allCompanies();
		res.json(companies);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET
 */
api.get('/users/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const user = await UsersController.findOne(req.params.id);
		res.json(user);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * POST
 */
api.post('/users', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const user = await UsersController.create(req.body);
		res.json(user);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * PUT
 */
api.put('/users/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const user = await UsersController.update(req.params.id, req.body);
		res.json(user);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * UPDATE PROFILE
 */
api.post('/profile', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const user = await UsersController.update(req.user.sub, req.body);
		res.json(user);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * UPDATE PROFILE
 */
api.post('/password_upd', md_auth.ensureAuth, async (req, res, next) => {
	try {
		if (!req.body.old) {
			return res.status(500).json({ message: 'Debe enviar la contraseña antigua' });
		}
		if (!req.body.password) {
			return res.status(500).json({ message: 'Debe enviar la contraseña nueva' });
		}
		const isValid = await UserController.verifyPassword(req.user.email, req.body.old);
		if (isValid) {
			const user = await UsersController.update(req.user.sub, {
				password: req.body.password
			});
			res.json(user);
		} else {
			res.status(500).json({ message: 'La contraseña original no es válida!' });
		}
	} catch (err) {
		console.error(err);
		if (err === 'Contraseña incorrecta') {
			return res.status(500).json({ message: 'La contraseña original no es válida!' });
		}
		res.status(500).json({ message: 'Hubo un error al actualizar la contraseña' });
	}
});

api.post('/updcompany', md_auth.ensureAuth, async (req, res, next) => {
	try {
		if (!req.body.company) {
			throw new Error('Debe enviar la compañía');
		}
		const user = await UsersController.findOne(req.user.sub);
		if (!user.admin) {
			throw new Error('No tiene permisos para cambiar la compañía');
		}
		await UsersController.update(req.user.sub, {
			company: req.body.company
		});
		const companyData = await UsersController.getCompany({ _id: req.body.company });
		const { password, ...userData } = user;

		res.status(200).json({
			message: 'User succesfully change company!',
			token: jwt.createToken({ ...userData, company: req.body.company }),
			companyData,
			...userData
		});
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

module.exports = api;
