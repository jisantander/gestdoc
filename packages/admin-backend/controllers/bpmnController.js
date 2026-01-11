'use strict';
const mongoose = require('mongoose');

const bpmnModel = require('../models/bpmnModel.js');
const procedureModel = require('../models/procedureModel.js');
const { getParticipants, verifyConsistency } = require('../lib/bpmnExtra');

/**
 * bpmnController.js
 *
 * @description :: Server-side logic for managing bpmn
 */
module.exports = {
	/**
	 * bpmnController.list()
	 */
	showAll: function (req, res) {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		let fieldsSelect = '_id _nameSchema';
		if (req.query.allfields) {
			fieldsSelect = '_id _nameSchema _bpmnModeler';
		}
		bpmnModel.find(filter, fieldsSelect, function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting bpmn.',
					error: err
				});
			}
			return res.json(bpmn);
		});
	},
	getGestores: function (req, res) {
		bpmnModel.findById(req.query.bpmn, async function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting bpmn.',
					error: err
				});
			}
			const data = await getParticipants(bpmn._bpmnModeler);
			return res.json({ participants: data });
		});
	},
	/**
	 * bpmnController.list()
	 */
	list: function (req, res) {
		bpmnModel.find(function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting bpmn.',
					error: err
				});
			}
			return res.json(bpmn);
		});
	},

	/**
	 *  bpmnController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		bpmnModel.findOne({ _id: id }, function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting bpmn.',
					error: err
				});
			}
			if (!bpmn) {
				return res.status(404).json({
					message: 'No such bpmn'
				});
			}
			return res.json(bpmn);
		});
	},

	/**
	 * bpmnController.create()
	 */
	create: function (req, res) {
		var bpmn = new bpmnModel({
			_bpmnModeler: req.body._bpmnModeler,
			_nameSchema: req.body._nameSchema,
			company: req.user.company,
			download: req.body.download
		});

		bpmn.save(function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating bpmn',
					error: err
				});
			}
			return res.status(201).json(bpmn);
		});
	},

	/**
	 * bpmnController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		//procedureModel
		bpmnModel.findOne({ _id: id }, async function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting bpmn',
					error: err
				});
			}
			if (!bpmn) {
				return res.status(404).json({
					message: 'No such bpmn'
				});
			}

			const proceduresActive = await procedureModel.count({
				bpmn: id,
				'gestores.current': { $ne: 'HAS_ENDED' }
			});
			if (proceduresActive > 0 && req.body.force !== true) {
				return res.status(500).json({
					message: `No se puede editar mientras haya procedimientos en curso (actualmente hay ${proceduresActive})`,
					error: `${proceduresActive} procedure active`
				});
			}

			bpmn._bpmnModeler = req.body._bpmnModeler ? req.body._bpmnModeler : bpmn._bpmnModeler;
			bpmn._nameSchema = req.body._nameSchema ? req.body._nameSchema : bpmn._nameSchema;
			bpmn._category = req.body._category ? req.body._category : bpmn._category;
			bpmn._description = req.body._description ? req.body._description : bpmn._description;
			bpmn._link = req.body._link ? req.body._link : bpmn._link;
			bpmn._requirements = req.body._requirements ? req.body._requirements : bpmn._requirements;
			bpmn._valor = req.body._valor ? req.body._valor : bpmn._valor;
			bpmn.download = req.body.download ? req.body.download : bpmn.download ? bpmn.download : null;

			if (bpmn._bpmnModeler) {
				const [isValid, errorsValid] = await verifyConsistency(bpmn._bpmnModeler);
				if (!isValid) {
					return res.status(500).json({
						message: 'El BPMN tiene errores de validación.',
						error: errorsValid
					});
				}
			}

			bpmn.save(function (err, bpmn) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating bpmn.',
						error: err
					});
				}

				return res.json(bpmn);
			});
		});
	},

	/**
	 * bpmnController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		bpmnModel.findByIdAndRemove(id, function (err, bpmn) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the bpmn.',
					error: err
				});
			}
			return res.status(204).json();
		});
	},
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			bpmnModel.paginate(
				filter,
				{
					sort: { _id: -1 },
					page,
					limit
				},
				(err, items) => {
					if (err) reject(err);
					resolve(items);
				}
			);
		});
	}
};
