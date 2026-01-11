'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Themedoc = Schema({
	_location: { type: String },
	_title: { type: String },
	_key: { type: String },
	company: { type: Schema.ObjectId, ref: 'companies' }
});

Themedoc.plugin(mongoosePaginate);

module.exports = mongoose.model('themedoc', Themedoc, 'themedoc');
