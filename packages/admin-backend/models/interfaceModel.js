const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const interfaceSchema = Schema(
	{
		title: {
			type: String,
			required: true,
			default: ''
		},
		type: {
			type: String,
			required: true,
			default: 'ODOO',
			enum: ['ODOO']
		},
		authJson: {
			type: String,
			trim: true,
			required: false
		},
		company: { type: Schema.ObjectId, ref: 'companies' }
	},
	{ timestamps: true }
);
interfaceSchema.plugin(mongoosePaginate);

const interfaceModel = mongoose.model('interfaces', interfaceSchema, 'interfaces');

module.exports = {
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			interfaceModel.paginate(
				filter,
				{
					sort: { _id: -1 },
					populate: { path: 'company', select: 'name' },
					select: 'type title company createdAt',
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
	findOne: (id) => {
		return new Promise((resolve, reject) => {
			interfaceModel.findById(id, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	findAll: (filter) => {
		return new Promise((resolve, reject) => {
			interfaceModel.find(filter, '_id type title createdAt', (err, data) => {
				if (err) return reject(err);
				resolve(data);
			});
		});
	},
	create: (data) => {
		return new Promise((resolve, reject) => {
			const interface = new interfaceModel(data);
			interface
				.save()
				.then(async (result) => {
					resolve(result._doc._id);
				})
				.catch((err) => reject(err));
		});
	},
	update: (id, data) => {
		return new Promise((resolve, reject) => {
			interfaceModel
				.update({ _id: id }, { $set: data })
				.exec()
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	},
	delete: (id) => {
		return new Promise((resolve, reject) => {
			interfaceModel.findByIdAndRemove(id, function (err, operation) {
				if (err) {
					reject(err);
				}
				resolve(true);
			});
		});
	}
};
