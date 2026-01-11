'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Emails = Schema({
	_title: { type: String },
	_recipient: { type: Array },
	_body: { type: String },
	_template: { type: Object },
	_subject: { type: String },
	_formValue: { type: Array },
	company: { type: Schema.ObjectId, ref: 'companies' }
});

Emails.plugin(mongoosePaginate);

module.exports = mongoose.model('emails', Emails, 'emails');
