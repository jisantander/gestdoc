'use strict';

var expirationModel = require('../models/expirationModel.js');

/**
 * expirationController.js
 *
 * @description :: Server-side logic for managing expirations.
 */
module.exports = {
	/**
	 * expirationController.list()
	 */
	list: function (req, res) {
		expirationModel.find(function (err, expirations) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting expiration.',
					error: err
				});
			}
			return res.json(expirations);
		});
	},

	/**
	 * expirationController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		expirationModel.findOne({ _id: id }, function (err, expiration) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting expiration.',
					error: err
				});
			}
			if (!expiration) {
				return res.status(404).json({
					message: 'No such expiration'
				});
			}
			return res.json(expiration);
		});
	},

	/**
	 * expirationController.create()
	 */
	create: function (req, res) {
		var expiration = new expirationModel({
			_expirationDate: req.body._expirationDate,
			_toTask: req.body._toTask,
			_isCompleted: req.body._isCompleted
		});

		expiration.save(function (err, expiration) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating expiration',
					error: err
				});
			}
			return res.status(201).json(expiration);
		});
	},

	/**
	 * expirationController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		expirationModel.findOne({ _id: id }, function (err, expiration) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting expiration',
					error: err
				});
			}
			if (!expiration) {
				return res.status(404).json({
					message: 'No such expiration'
				});
			}

			expiration._expirationDate = req.body._expirationDate
				? req.body._expirationDate
				: expiration._expirationDate;
			expiration._toTask = req.body._toTask ? req.body._toTask : expiration._toTask;
			expiration._isCompleted = req.body._isCompleted ? req.body._isCompleted : expiration._isCompleted;

			expiration.save(function (err, expiration) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating expiration.',
						error: err
					});
				}

				return res.json(expiration);
			});
		});
	},

	/**
	 * expirationController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		expirationModel.findByIdAndRemove(id, function (err, expiration) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the expiration.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};
