'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = Schema(
	{
		name: { type: String, trim: true, required: true },
		surname: { type: String, trim: true, required: true },
		email: { type: String, unique: true, required: true, trim: true },
		password: {
			type: String,
			required: false,
			match: [/.{6,}/, 'Mínimo 6 caracteres']
		},
		role: String,
		admin: { type: Boolean, default: false },
		group: [{ type: Schema.ObjectId, ref: 'Usergroup' }],
		image: String,
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		routes: [{ type: String }],
		company: { type: Schema.ObjectId, ref: 'companies' },
		ecert_rut: String,
		ecert_nombre: String,
		ecert_appat: String,
		ecert_apmat: String,
		ecert_title_rol: String
	},
	{ usePushEach: true }
);

UserSchema.plugin(mongoosePaginate);

// Hash user's password on save middleware
UserSchema.pre('save', function (next) {
	var user = this;
	var SALT_FACTOR = 5;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});
UserSchema.pre('update', async function (next) {
	try {
		var user = this;
		var SALT_FACTOR = 5;
		if (user._update['$set']) {
			if (user._update['$set'].password) {
				bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
					if (err) return next(err);

					bcrypt.hash(user._update['$set'].password, salt, null, function (err, hash) {
						if (err) return next(err);
						user._update['$set'].password = hash;
						next();
					});
				});
			} else {
				next();
			}
		} else {
			next();
		}
	} catch (err) {
		return next(err);
	}
});

// user's password comparison
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);
