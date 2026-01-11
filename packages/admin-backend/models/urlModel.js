const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
	{
		urlCode: String,
		longUrl: String,
		rxsUrl: String,
		shortUrl: String,
		clickCount: Number
	},
	{ timestamps: true }
);

const urlModel = mongoose.model('url', urlSchema);

module.exports = {
	findById: (id) => {
		return new Promise((resolve, reject) => {
			urlModel.findOne({ _id: id }, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	findByCode: (code) => {
		return new Promise((resolve, reject) => {
			urlModel.findOne({ urlCode: code }, (err, data) => {
				if (err) return reject(err);
				resolve({
					...data._doc
				});
			});
		});
	},
	create: (data) => {
		return new Promise((resolve, reject) => {
			const urlDoc = new urlModel(data);
			urlDoc
				.save()
				.then(async (result) => {
					resolve(result._doc._id);
				})
				.catch((err) => reject(err));
		});
	},
	updClick: (code) => {
		return new Promise(async (resolve, reject) => {
			urlModel.findOne({ urlCode: code }, (err, data) => {
				if (err) return reject(err);
				urlModel
					.update(
						{ _id: data._doc._id },
						{
							$set: { clickCount: data._doc.clickCount + 1 }
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
		});
	}
};
