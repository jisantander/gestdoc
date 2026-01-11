'use strict';

var historyModel = require('../models/historyModel.js');

var documentGenerator = require('../services/documentGenerator.js');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

/**
 * historyController.js
 *
 * @description :: Server-side logic for managing historys.
 */
module.exports = {
	/**
	 * historyController.list()
	 */
	list: function (req, res) {
		historyModel.find(function (err, historys) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting history.',
					error: err
				});
			}
			return res.json(historys);
		});
	},

	/**
	 * historyController.create()
	 */
	create: function (req, res) {
		var history = new historyModel({
			_operationId: req.body._operationId,
			_taskName: req.body._taskName,
			_doneAt: req.body._doneAt,
			_doneBy: req.body._doneBy,
			_observation: req.body._observation
		});

		history.save(function (err, history) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating history',
					error: err
				});
			}
			return res.status(201).json(history);
		});
	},

	/**
	 * historyController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		historyModel.findOne({ _id: id }, function (err, history) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting history',
					error: err
				});
			}
			if (!history) {
				return res.status(404).json({
					message: 'No such history'
				});
			}

			history._operationId = req.body._operationId ? req.body._operationId : history._operationId;
			history._taskName = req.body._taskName ? req.body._taskName : history._taskName;
			history._doneAt = req.body._doneAt ? req.body._doneAt : history._doneAt;
			history._doneBy = req.body._doneBy ? req.body._doneBy : history._doneBy;
			history._observation = req.body._observation ? req.body._observation : history._observation;

			history.save(function (err, history) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating history.',
						error: err
					});
				}

				return res.json(history);
			});
		});
	},

	/**
	 * historyController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		historyModel.findByIdAndRemove(id, function (err, history) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the history.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};
