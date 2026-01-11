const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const companySchema = Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true
		}
	},
	{ timestamps: true }
);
companySchema.plugin(mongoosePaginate);

const companyModel = mongoose.model('companies', companySchema, 'companies');

module.exports = {
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			companyModel.paginate(
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
	},
	findAll: () => {
		return new Promise(function (resolve, reject) {
			companyModel.find({}, '_id name', (err, items) => {
				if (err) reject(err);
				resolve(items);
			});
		});
	},
	findOne: (id) => {
		return new Promise((resolve, reject) => {
			companyModel.findById(id, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	/**
	 * Función para crear compañía
	 * @param data Object
	 */
	create: (data) => {
		return new Promise((resolve, reject) => {
			const company = new companyModel(data);
			company
				.save()
				.then((result) => {
					resolve({ ...result._doc });
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	},
	update: (id, data) => {
		return new Promise((resolve, reject) => {
			companyModel
				.update(
					{ _id: id },
					{
						$set: data
					}
				)
				.exec()
				.then(() => {
					resolve(true);
				})
				.catch((err) => {
					console.error(err);
					reject(err);
				});
		});
	},
	remove: (id) => {
		return new Promise((resolve, reject) => {
			companyModel.deleteOne({ _id: id }, function (err) {
				if (err) return reject(err);
				resolve(true);
			});
		});
	}
};
