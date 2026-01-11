var express = require('express');
var router = express.Router();
var formController = require('../controllers/formController.js');
var md_auth = require('../middlewares/authenticate');

/*
 * GET
 */
router.get('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let filter = req.query.filter ? req.query.filter : { company: req.user.company };
		if (typeof filter === 'string') {
			filter = JSON.parse(filter);
			if (filter._title) {
				filter._title = { $regex: filter._title, $options: 'i' };
			}
		}
		filter.company = req.user.company;
		const items = await formController.find({
			filter,
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit)
		});
		res.json(items);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/all', md_auth.ensureAuth, formController.list);

router.get('/tags', md_auth.ensureAuth, formController.getTags);

/*
 * GET
 */
router.get('/:id', formController.show);

/*
 * POST
 */
router.post('/', md_auth.ensureAuth, formController.create);

/*
 * PUT
 */
router.put('/:id', formController.update);

/*
 * DELETE
 */
router.delete('/:id', formController.remove);

module.exports = router;
