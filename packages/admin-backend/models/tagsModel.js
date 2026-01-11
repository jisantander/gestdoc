const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const tagSchema = Schema(
	{
		name: {
			type: String,
			trim: true,
			uppercase: true,
			required: false,
			unique: true
		},
		company: { type: Schema.ObjectId, ref: 'companies' }
	},
	{ timestamps: true }
);
tagSchema.plugin(mongoosePaginate);

const tagsModel = mongoose.model('tags', tagSchema, 'tags');

module.exports = {
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			tagsModel.paginate(
				filter,
				{
					sort: { name: 1 },
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
	findAll: (filter) => {
		return new Promise(function (resolve, reject) {
			tagsModel.find(filter, function (err, forms) {
				if (err) {
					reject(err);
				}
				resolve(forms);
			});
		});
	},
	findOne: (id) => {
		return new Promise((resolve, reject) => {
			tagsModel.findById(id, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	create: (data) => {
		return new Promise((resolve, reject) => {
			tagsModel.findOne({ name: data.name }, (err, tag) => {
				if (err) return reject(err);
				if (!tag) {
					const tagObject = new tagsModel(data);
					tagObject
						.save()
						.then(async (result) => {
							resolve(result._doc._id);
						})
						.catch((err) => reject(err));
				} else {
					resolve(tag._doc._id);
				}
			});
		});
	}
};
