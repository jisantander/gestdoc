'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var tagModel = require('./tagsModel');

var Schema = mongoose.Schema;

var FormsSchema = Schema({
	_stringJson: { type: String },
	_stringUiJson: { type: String },
	_title: { type: String, trim: true },
	_alias: { type: String },
	_description: { type: String },
	_properties: [{ type: String }],
	company: { type: Schema.ObjectId, ref: 'companies' },
	tags: [{ type: String }]
});
FormsSchema.pre('save', function (next) {
	var form = this;
	if (form.tags) {
		if (form.tags.length > 0) {
			form.tags.forEach((item) => {
				try {
					tagModel.create({ name: item });
				} catch (e) {
					console.error(e);
				}
			});
		}
	}
	next();
});

FormsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Forms', FormsSchema);
