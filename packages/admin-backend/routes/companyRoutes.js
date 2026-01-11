const express = require('express');
const router = express.Router();

const md_auth = require('../middlewares/authenticate');

const modelCompany = require('../models/companyModel');

/*
 * GET
 */
router.get('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let filter = req.query.filter ? req.query.filter : {};
		if (typeof filter === 'string') {
			filter = JSON.parse(filter);
			if (filter.name) {
				filter.name = { $regex: filter.name, $options: 'i' };
			}
		}
		const companies = await modelCompany.find({
			filter,
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit)
		});
		res.json(companies);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/all', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const companies = await modelCompany.findAll();
		res.json(companies);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const company = await modelCompany.findOne(req.params.id);
		res.json(company);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * POST
 */
router.post('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const company = await modelCompany.create(req.body);
		res.json(company);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * PUT
 */
router.put('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const company = await modelCompany.update(req.params.id, req.body);
		res.json(company);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * DELETE
 */
router.delete('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const company = await modelCompany.remove(req.params.id);
		res.json(company);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

module.exports = router;
