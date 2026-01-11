'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorySchema = Schema(
	{
		_operationId: { type: Schema.ObjectId, ref: 'Operation' },
		_taskName: { type: String },
		_doneAt: { type: Date, default: Date.now },
		_doneBy: { type: String },
		_observation: { type: String }
	},
	{ usePushEach: true }
);

module.exports = mongoose.model('History', HistorySchema);
