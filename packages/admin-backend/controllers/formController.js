'use strict';

var formsModel = require('../models/formsModel.js');
var tagsModel = require('../models/tagsModel.js');
var mongoose = require('mongoose');

/**
 * formController.js
 *
 * @description :: Server-side logic for managing forms.
 */
module.exports = {
	/**
	 * formController.list()
	 */
	list: function (req, res) {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		formsModel.find(filter, function (err, forms) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting form.',
					error: err
				});
			}
			return res.json(forms);
		});
	},

	getTags: async function (req, res) {
		try {
			const filter = {};
			if (req.user.company) filter.company = req.user.company;
			const tags = await tagsModel.findAll(filter);
			res.json(tags);
		} catch (err) {
			console.error(err);
			res.status(500).json({
				message: 'Error when getting form tags.',
				error: err
			});
		}
	},

	/**
	 *  formController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		formsModel.findOne({ _id: id }, function (err, form) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting form.',
					error: err
				});
			}
			if (!form) {
				return res.status(404).json({
					message: 'No such form'
				});
			}
			return res.json(form);
		});
	},

	/**
	 * formController.create()
	 */
	create: function (req, res) {
		debugger;
		console.log('req.body', req.body);
		var form = new formsModel({
			_stringJson: req.body._stringJson,
			_stringUiJson: req.body._stringUiJson,
			_title: req.body._title,
			_properties: req.body._properties,
			company: req.user.company,
			_alias: req.body._alias,
			_description: req.body._description,
			tags: req.body.tags
		});

		console.log('form', form);

		form.save(function (err, form) {
			if (err) {
				console.error(err);
				return res.status(500).json({
					message: 'Error when creating form',
					error: err
				});
			}

			return res.json(form);
		});
	},

	/**
	 * formController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		formsModel.findOne({ _id: id }, function (err, form) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting form',
					error: err
				});
			}
			if (!form) {
				return res.status(404).json({
					message: 'No such form'
				});
			}

			form._stringJson = req.body._stringJson ? req.body._stringJson : form._stringJson;
			form._alias = req.body._alias ? req.body._alias : form._alias;

			form._description = req.body._description ? req.body._description : form._description;
			form._stringUiJson = req.body._stringUiJson ? req.body._stringUiJson : form._stringUiJson;
			form._title = req.body._title ? req.body._title : form._title;
			form.tags = req.body.tags ? req.body.tags : form.tags;
			form._properties = req.body._properties ? req.body._properties : form._properties;

			form.save(function (err, form) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating form.',
						error: err
					});
				}

				return res.json(form);
			});
		});
	},

	/**
	 * formController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		formsModel.findByIdAndRemove(id, function (err, form) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the form.',
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
			formsModel.paginate(
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
