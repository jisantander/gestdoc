var express = require('express');
var router = express.Router();
var themedocController = require('../controllers/themedocController.js');
var md_auth = require('../middlewares/authenticate');

const multer = require('multer');
const storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	}
});
const upload = multer({ storage }).single('file');
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
		const items = await themedocController.find({
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
router.get('/all', md_auth.ensureAuth, themedocController.list);

/*
 * GET
 */
router.get('/:id', themedocController.show);

/*
 * POST
 */
router.post('/', md_auth.ensureAuth, themedocController.create);

/*
 * PUT
 */
router.put('/:id', upload, themedocController.update);

/*
 * DELETE
 */
router.delete('/:id', themedocController.remove);

/*
 * GET
 */
router.get('/doc/:id', themedocController.getDoc);

module.exports = router;
