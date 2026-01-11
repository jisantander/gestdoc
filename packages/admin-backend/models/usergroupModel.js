'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsergroupSchema = Schema({
	_usergroupName: { type: String, unique: true, lowercase: true }
});

module.exports = mongoose.model('Usergroup', UsergroupSchema);
