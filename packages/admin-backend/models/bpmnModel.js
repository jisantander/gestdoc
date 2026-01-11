'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var BpmnSchema = Schema(
	{
		_bpmnModeler: { type: String },
		_nameSchema: { type: String },
		_category: { type: String },
		_description: { type: String },
		_link: { type: String },
		_requirements: { type: Array },
		_valor: { type: Number },
		company: { type: Schema.ObjectId, ref: 'companies' },
		download: { type: String },
		quick: { type: Schema.ObjectId, ref: 'url' },
	},
	{ timestamps: true }
);

BpmnSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Bpmn', BpmnSchema, 'bpmn');
