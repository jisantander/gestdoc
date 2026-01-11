const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const shortid = require('shortid');
const moment = require('moment');

const urlModel = require('./urlModel');

const Schema = mongoose.Schema;

const getBpmnData = require('../lib/bpmnAnalyser');

const DEFAULT_TOTAL = 10000;

const procedureSchema = Schema(
	{
		step: {
			type: Number,
			required: true,
			default: 1
		},
		bpmn: {
			type: mongoose.ObjectId,
			ref: 'Bpmn',
			required: false
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: false
		},
		user: {
			type: mongoose.ObjectId,
			ref: 'User',
			required: false
		},
		payment: {
			type: String,
			default: ''
		},
		total: {
			type: Number,
			required: false,
			default: DEFAULT_TOTAL
		},
		gestores: [
			{
				type: Schema.Types.Mixed
			}
		],
		signatures: [
			{
				type: Schema.Types.Mixed
			}
		],
		checks: [
			{
				type: String
			}
		],
		result_doc: {
			type: String,
			required: false,
			default: ''
		},
		sequence: {
			type: Number,
			required: false
		},
		origin: {
			type: String,
			default: 'admin'
		},
		short: { type: String, default: '' },
		company: { type: Schema.ObjectId, ref: 'companies' },
		url: { type: String, required: false }
	},
	{ timestamps: true }
);
procedureSchema.plugin(mongoosePaginate);
procedureSchema.plugin(AutoIncrement, {
	id: 'procedure_seq',
	inc_field: 'sequence',
	reference_fields: ['company']
});

const procedureModel = mongoose.model('procedures', procedureSchema, 'procedures');

module.exports = {
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10, due = false }) => {
		return new Promise(function (resolve, reject) {
			procedureModel.paginate(
				filter,
				{
					sort: { _id: -1 },
					populate: { path: 'bpmn', select: '_nameSchema' },
					select: 'bpmn user email createdAt sequence gestores.current gestores.id gestores.name gestores.current_name gestores.vence origin',
					page,
					limit
				},
				(err, items) => {
					if (err) reject(err);
					resolve(items);
				}
			);
		});
	},
	findField: (filter, fields, populate = false) => {
		return new Promise(function (resolve, reject) {
			if (populate) {
				procedureModel
					.find(filter, fields)
					.populate('bpmn', populate)
					.exec((err, data) => {
						if (err) return reject(err);
						resolve(data);
					});
			} else {
				procedureModel.find(filter, fields, (err, data) => {
					if (err) return reject(err);
					resolve(data);
				});
			}
		});
	},
	findOne: (id) => {
		return new Promise((resolve, reject) => {
			procedureModel.findById(id, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	getDocumento: (id, getBpmn = true) => {
		return new Promise((resolve, reject) => {
			procedureModel.findById(id, async (err, data) => {
				if (err) return reject(err);
				if (!data) return reject('No se encontro el documento');
				try {
					let documento = false;
					if (getBpmn && data._doc.bpmn) {
						documento = await getBpmnData(
							data._doc.bpmn,
							'current',
							data._doc.gestores.map((it) => {
								return { id: it.id, current: it.current };
							})
						);
					}
					resolve({
						...data._doc,
						id: data._doc._id,
						documento: documento
					});
				} catch (e) {
					reject(e);
				}
			});
		});
	},
	createDocumento: (data) => {
		// el nombre deberia ser crear un proceso.
		return new Promise(async (resolve, reject) => {
			try {
				const documento = await getBpmnData(data.bpmn);
				let shortCode = shortid();
				shortCode = `A${moment().format('yyyyMM')}${shortCode}`;
				const procedure = new procedureModel({
					short: shortCode,
					gestores: documento.participants.map((item) => {
						const userId = data.participants.find((it) => it.id === item.id);
						const gestorData = {
							id: item.id,
							name: item.name,
							processRef: item.processRef,
							start: item.start,
							current: item.start,
							user: userId.user,
							history: {}
						};
						if (item.next) {
							if (item.next.name) gestorData.current_name = item.next.name;
							if (item.next['custom:days']) {
								gestorData.vence = parseFloat(item.next['custom:days']);
								gestorData.due_date = moment().add(gestorData.vence, 'days').toDate();
							}
						}
						return gestorData;
					}),
					...data
				});
				procedure
					.save()
					.then((result) => {
						urlModel.create({
							shortUrl: `${process.env.GESTDOC_URL}/p/${shortCode}`,
							longUrl: `${process.env.GESTDOC_URL}/procedure/${result._id}`,
							rxsUrl: `/procedure/${result._id}`,
							urlCode: shortCode,
							clickCount: 0
						});
						resolve({ ...result._doc, id: result._id, documento });
					})
					.catch((err) => {
						console.error(err);
						reject(err);
					});
			} catch (err) {
				reject(err);
			}
		});
	},
	findCurrentFlow: (bpmnId, currentFlow) => {
		return new Promise((resolve, reject) => {
			procedureModel.find({ bpmn: bpmnId, 'gestores.current': currentFlow }, (err, data) => {
				if (err) return reject(err);
				resolve(data);
			});
		});
	},
	count: (filter) => {
		return new Promise((resolve, reject) => {
			procedureModel.count(filter, function (err, result) {
				if (err) return reject(err);
				resolve(result);
			});
		});
	},
	deleteDocument: (id) => {
		return new Promise((resolve, reject) => {
			procedureModel.findByIdAndRemove(id, function (err, operation) {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	},
	findAllDocuments: (filter = {}) => {
		return new Promise((resolve, reject) => {
			procedureModel.find(filter, (err, items) => {
				if (err) return reject(err);
				resolve(items);
			});
		});
	},
	deleteAllDocuments: (filter = { error: true }) => {
		return new Promise((resolve, reject) => {
			procedureModel.deleteMany(filter, function (err, operation) {
				if (err) return reject(err);
				resolve(true);
			});
		});
	},
	reportMostSelled: ({ start, end, company = false }) => {
		return new Promise(async (resolve, reject) => {
			const filter = {
				paid_amount: {
					$gt: 0
				},
				createdAt: {
					$gte: start,
					$lte: end
				}
			};
			if (company) {
				filter.company = mongoose.Types.ObjectId(company);
			}
			procedureModel.aggregate(
				[
					{
						$match: filter
					},
					{
						$group: {
							_id: '$bpmn',
							paid_amount: {
								$sum: '$paid_amount'
							},
							count: {
								$sum: 1
							}
						}
					},
					{
						$sort: {
							paid_amount: -1
						}
					},
					{ $limit: 10 },
					{
						$sort: {
							paid_amount: 1
						}
					},
					{
						$lookup: {
							from: 'bpmn',
							localField: '_id',
							foreignField: '_id',
							as: 'bpmn'
						}
					},
					{
						$project: {
							bpmn: { $first: '$bpmn._nameSchema' },
							paid_amount: '$paid_amount',
							count: '$count'
						}
					}
				],
				function (err, data) {
					if (err) {
						console.error(err);
						reject(err);
					}
					resolve(data);
				}
			);
		});
	},
	reportStates: ({ company = false, bpmn = false }) => {
		return new Promise((resolve, reject) => {
			const firstFilter = {
				'gestores.current': {
					$ne: 'HAS_ENDED'
				}
				/*"gestores.due_date": {
					$exists: true,
				},*/
			};
			if (company) {
				firstFilter.company = mongoose.Types.ObjectId(company);
			}
			if (bpmn) {
				firstFilter.bpmn = mongoose.Types.ObjectId(bpmn);
			}
			procedureModel.aggregate(
				[
					{ $match: firstFilter },
					{
						$lookup: {
							from: 'bpmn',
							localField: 'bpmn',
							foreignField: '_id',
							as: 'bpmn'
						}
					},
					{
						$project: {
							bpmn: { $first: '$bpmn._nameSchema' },
							due_date: {
								$first: '$gestores.due_date'
							}
						}
					},
					{
						$project: {
							bpmn: '$bpmn',
							due_date: {
								$ifNull: ['$due_date', moment().add(1, 'day').toDate()]
							}
						}
					},
					{
						$project: {
							due_date: {
								$dateToString: {
									format: '%Y-%m-%d',
									date: '$due_date'
								}
							}
						}
					},
					{
						$group: {
							_id: '$due_date',
							total: {
								$sum: 1
							}
						}
					},
					{
						$addFields: {
							convertedDate: {
								$toDate: '$_id'
							}
						}
					},
					{
						$sort: {
							convertedDate: -1
						}
					}
				],
				function (err, data) {
					if (err) {
						console.error(err);
						reject(err);
					}
					resolve(data);
				}
			);
		});
	}
};
