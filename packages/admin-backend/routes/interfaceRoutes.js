'use strict';

var express = require('express');
const interfaceModel = require('../models/interfaceModel');
var md_auth = require('../middlewares/authenticate');
const odooInterface = require('../lib/odoo');

var api = express.Router();

/*
 * GET PAGE
 */
api.get('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let filter = req.query.filter ? req.query.filter : {};
		if (typeof filter === 'string') {
			filter = JSON.parse(filter);
			if (filter.name) {
				const value = filter.name;
				filter = {
					$or: [{ type: { $regex: value, $options: 'i' } }]
				};
			}
		}
		const interfaces = await interfaceModel.find({
			filter,
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit)
		});
		res.json(interfaces);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET ALL
 */
api.get('/all', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		const interfaces = await interfaceModel.findAll(filter);
		res.json(interfaces);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET ONE
 */
api.get('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const interfaceDoc = await interfaceModel.findOne(req.params.id);
		res.json(interfaceDoc);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * POST INFO ODOO
 */
api.post('/odoo', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const interfaceDoc = await interfaceModel.findOne(req.body.interface);
		const employee = await odooInterface.getRut(JSON.parse(interfaceDoc.authJson), req.body.rut);
		res.json(employee);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * POST
 */
api.post('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const interfaceDoc = await interfaceModel.create(req.body);
		res.json(interfaceDoc);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * PUT
 */
api.put('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const interfaceDoc = await interfaceModel.update(req.params.id, req.body);
		res.json(interfaceDoc);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

module.exports = api;
