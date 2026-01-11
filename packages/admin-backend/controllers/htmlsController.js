'use strict';

var htmlsModel = require('../models/htmlsModel.js');
var mongoose = require('mongoose');

/**
 * htmlsController.js
 *
 * @description :: Server-side logic for managing htmls.
 */
module.exports = {
	/**
	 * htmlsController.list()
	 */
	list: function (req, res) {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		htmlsModel.find(filter, function (err, htmls) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting htmls.',
					error: err
				});
			}
			return res.json(htmls);
		});
	},

	/**
	 *  htmlsController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		htmlsModel.findOne({ _id: id }, function (err, htmls) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting htmls.',
					error: err
				});
			}
			if (!htmls) {
				return res.status(404).json({
					message: 'No such htmls'
				});
			}
			return res.json(htmls);
		});
	},

	/**
	 * htmlsController.create()
	 */
	create: function (req, res) {
		var htmls = new htmlsModel({
			_title: req.body._title,
			_body: req.body._body,
			_template: req.body._template,
			company: req.user.company
		});

		htmls.save(function (err, htmls) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating htmls',
					error: err
				});
			}
			return res.status(201).json(htmls);
		});
	},

	/**
	 * htmlsController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		htmlsModel.findOne({ _id: id }, function (err, htmls) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting htmls',
					error: err
				});
			}
			if (!htmls) {
				return res.status(404).json({
					message: 'No such htmls'
				});
			}

			htmls._title = req.body._title ? req.body._title : htmls._title;
			htmls._body = req.body._body ? req.body._body : htmls._body;
			htmls._template = req.body._template ? req.body._template : htmls._template;

			htmls.save(function (err, htmls) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating htmls.',
						error: err
					});
				}

				return res.json(htmls);
			});
		});
	},

	/**
	 * htmlsController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		htmlsModel.findByIdAndRemove(id, function (err, htmls) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the htmls.',
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
			htmlsModel.paginate(
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
