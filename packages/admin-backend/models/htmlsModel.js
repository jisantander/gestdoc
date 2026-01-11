'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Htmls = Schema({
	_title: { type: String },
	_body: { type: String },
	_template: { type: Object },
	company: { type: Schema.ObjectId, ref: 'companies' }
});

Htmls.plugin(mongoosePaginate);

module.exports = mongoose.model('htmls', Htmls, 'htmls');
