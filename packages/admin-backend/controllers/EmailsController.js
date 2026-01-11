'use strict';

var emailsModel = require('../models/EmailsModel.js');
var mongoose = require('mongoose');

/**
 * emailController.js
 *
 * @description :: Server-side logic for managing emails.
 */
module.exports = {
	/**
	 * emailController.list()
	 */
	list: function (req, res) {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		emailsModel.find(filter, function (err, emails) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting email.',
					error: err
				});
			}
			return res.json(emails);
		});
	},

	/**
	 *  emailController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		emailsModel.findOne({ _id: id }, function (err, email) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting email.',
					error: err
				});
			}
			if (!email) {
				return res.status(404).json({
					message: 'No such email'
				});
			}
			return res.json(email);
		});
	},

	/**
	 * emailController.create()
	 */
	create: function (req, res) {
		var email = new emailsModel({
			_title: req.body._title,
			_recipient: req.body._recipient,
			_body: req.body._body,
			_template: req.body._template,
			_subject: req.body._subject,
			_formValue: req.body._formValue,
			company: req.user.company
		});

		email.save(function (err, email) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating email',
					error: err
				});
			}
			return res.status(201).json(email);
		});
	},

	/**
	 * emailController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		emailsModel.findOne({ _id: id }, function (err, email) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting email',
					error: err
				});
			}
			if (!email) {
				return res.status(404).json({
					message: 'No such email'
				});
			}

			email._title = req.body._title ? req.body._title : email._title;
			email._recipient = req.body._recipient ? req.body._recipient : email._recipient;
			email._body = req.body._body ? req.body._body : email._body;
			email._template = req.body._template ? req.body._template : email._template;
			email._subject = req.body._subject ? req.body._subject : email._subject;
			email._formValue = req.body._formValue ? req.body._formValue : email._formValue;

			email.save(function (err, email) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating email.',
						error: err
					});
				}

				return res.json(email);
			});
		});
	},

	/**
	 * emailController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		emailsModel.findByIdAndRemove(id, function (err, email) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the email.',
					error: err
				});
			}
			return res.status(204).json();
		});
	},
	/**
	 * Función de listado
	 */
	find: ({ filter = {}, page = 1, limit = 10 }) => {
		return new Promise(function (resolve, reject) {
			emailsModel.paginate(
				filter,
				{
					sort: { _id: -1 },
					page,
					limit
				},
				(err, items) => {
					if (err) reject(err);
					resolve(items);
				}
			);
		});
	}
};
