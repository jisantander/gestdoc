const userModel = require('../models/userModel');
const companyModel = require('../models/companyModel');

module.exports = {
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			filter['role'] = { $ne: 'VISITOR' };
			userModel.paginate(
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
	showAll: (filter = {}) => {
		return new Promise((resolve, reject) => {
			userModel.find(
				filter,
				'_id name surname email ecert_rut ecert_nombre ecert_appat ecert_apmat ecert_title_rol',
				function (err, users) {
					if (err) {
						reject(err);
					}
					resolve(users);
				}
			);
		});
	},
	findOne: (id) => {
		return new Promise((resolve, reject) => {
			userModel.findById(id, (err, data) => {
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
			const company = new userModel(data);
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
			userModel
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
			userModel.deleteOne({ _id: id }, function (err) {
				if (err) return reject(err);
				resolve(true);
			});
		});
	},
	getCompany: (id) => {
		return new Promise(async (resolve, reject) => {
			const company = await companyModel.findOne(id);
			resolve(company);
		});
	},
	allCompanies: () => {
		return new Promise(async (resolve, reject) => {
			const companies = await companyModel.findAll();
			resolve(companies);
		});
	}
};
