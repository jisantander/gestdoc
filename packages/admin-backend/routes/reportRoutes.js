const express = require('express');
const router = express.Router();
const moment = require('moment');

const md_auth = require('../middlewares/authenticate');

const model = require('../models/procedureModel');

/*
 * Report Most Selled
 */
router.post('/most-selled', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const company = req.user.company ? req.user.company : false;
		const data = await model.reportMostSelled({
			start: new Date(req.body.start),
			end: new Date(req.body.end),
			company
		});
		res.json({
			data: data.map((item) => {
				return {
					bpmn: `[${item.count}] ${item.bpmn}`,
					amount: item.paid_amount
				};
			})
		});
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * Report Most Selled
 */
router.post('/graph-states', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const bpmn = req.body.bpmn !== '-' ? req.body.bpmn : false;
		const company = req.user.company ? req.user.company : false;
		const data = await model.reportStates({ company, bpmn });
		const newTotals = [
			{ state: 'Al día', total: 0 },
			{ state: 'Atrasado', total: 0 },
			{ state: 'Vencido', total: 0 }
		];
		const today = moment().startOf('day');
		data.forEach((item) => {
			const m = moment(item._id);
			const days = Math.round(moment.duration(today - m).asDays());
			if (days <= -3) newTotals[0].total += item.total;
			if (days > -3 && days <= 0) newTotals[1].total += item.total;
			if (days > 0) newTotals[2].total += item.total;
		});
		res.json({
			data: newTotals
		});
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

module.exports = router;
