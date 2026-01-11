const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const trashSchema = new Schema(
	{
		bpmn: {
			type: mongoose.ObjectId,
			ref: 'bpmn',
			required: false
		},
		email: {
			type: String,
			trim: true,
			lowercase: true
			//required: true,
		},
		user: {
			type: mongoose.ObjectId,
			ref: 'users',
			required: false
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
		ecert: [
			{
				type: Schema.Types.Mixed
			}
		],
		oldEcert: [
			{
				type: Schema.Types.Mixed
			}
		],
		upload: { type: String, default: '' },
		checks: [
			{
				type: String
			}
		],
		paid_amount: {
			type: Number,
			default: 0
		},
		reviews: [
			{
				type: Schema.Types.Mixed
			}
		],
		oldReviews: [
			{
				type: Schema.Types.Mixed
			}
		],
		returnData: {
			type: Schema.Types.Mixed
		},
		sequence: {
			type: Number,
			required: false
		},
		origin: {
			type: String,
			default: 'express'
		},
		short: { type: String, default: '' },
		company: {
			type: Schema.ObjectId,
			ref: 'companies',
			default: process.env.OBJECTID_COMPANY
		},
		deletedAt: {
			type: Date,
			default: Date.now
		}
	},
	{ timestamps: true }
);
trashSchema.plugin(mongoosePaginate);
const trashModel = mongoose.model('trash', trashSchema);

module.exports = {
	find: (filter = {}, page = 1, limit = 10) => {
		return new Promise(function (resolve, reject) {
			trashModel.paginate(
				filter,
				{
					sort: { _id: -1 },
					populate: 'bpmn',
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
			trashModel
				.findById(id, async (err, { _doc: procedure }) => {
					if (err) reject(err);
					resolve(procedure);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	createMany: (data, user) => {
		return new Promise((resolve, reject) => {
			data = data.map((item) => {
				item.deletedAt = new Date();
				item.deletedBy = user;
				return item;
			});
			trashModel.insertMany(data, (err, items) => {
				if (err) reject(err);
				resolve(items);
			});
		});
	}
};
