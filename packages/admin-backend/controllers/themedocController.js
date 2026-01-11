'use strict';

var themedocModel = require('../models/themedocModel.js');
var mongoose = require('mongoose');
var async = require('async');
const multer = require('multer');
const AWS = require('aws-sdk');

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
	accessKeyId: S3_KEY,
	secretAccessKey: S3_SECRET,
	region: S3_REGION
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	}
});

const upload = multer({ storage }).single('file');

/**
 * themeController.js
 *
 * @description :: Server-side logic for managing themedoc.
 */
module.exports = {
	/**
	 * themeController.list()
	 */
	list: function (req, res) {
		const filter = {};
		if (req.user.company) {
			filter.company = req.user.company;
		}
		themedocModel.find(filter, function (err, themedoc) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting theme.',
					error: err
				});
			}
			return res.json(themedoc);
		});
	},

	/**
	 *  themeController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		themedocModel.findOne({ _id: id }, function (err, theme) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting theme.',
					error: err
				});
			}
			if (!theme) {
				return res.status(404).json({
					message: 'No such theme'
				});
			}
			return res.json(theme);
		});
	},

	/**
	 *  themeController.getDoc()
	 */
	getDoc: function (req, res) {
		var id = req.params.id;

		var s3 = new AWS.S3();

		themedocModel.findOne({ _id: id }, function (err, theme) {
			const key = id + '.docx';
			var params = { Bucket: S3_BUCKET, Key: key };
			s3.getObject(params, async (err, file) => {
				if (err) {
					return res.status(404).json({
						message: 'No such file',
						error: err
					});
				}
				res.attachment(key);
				s3.getObject(params).createReadStream().pipe(res);
			});
		});
	},

	/**
	 * themeController.create()
	 */
	create: function (req, res) {
		//TODO:modificar esto, no corresponden todos los campos.
		var theme = new themedocModel({
			_title: req.body._title,
			company: req.user.company
		});

		theme.save(function (err, theme) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating theme',
					error: err
				});
			}
			return res.status(201).json(theme);
		});
	},

	/**
	 * themeController.update()
	 */
	update: function (req, res) {
		const id = req.params.id;
		themedocModel.findOne({ _id: id }, function (err, theme) {
			if (req.files?.file) {
				let myFile = req.files.file.name.split('.');
				const fileType = myFile[myFile.length - 1];

				const params = {
					Bucket: S3_BUCKET,
					Key: `${id}.${fileType}`,
					Body: req.files.file.data
				};

				s3.upload(params, (error, data) => {
					if (error) {
						res.status(500).send(error);
					}
					theme._location = data.Location;
					theme._key = data.Key;
					theme.save(function (err, theme) {
						if (err) {
							return res.status(500).json({
								message: 'Error when updating theme.',
								error: err
							});
						}

						return res.json(theme);
					});
				});
			} else {
				if (err) {
					return res.status(500).json({
						message: 'Error when getting theme',
						error: err
					});
				}
				if (!theme) {
					return res.status(404).json({
						message: 'No such theme'
					});
				}

				theme._stringJson = req.body._stringJson ? req.body._stringJson : theme._stringJson;
				theme._stringUiJson = req.body._stringUiJson ? req.body._stringJson : theme._stringJson;
				theme._title = req.body._title ? req.body._title : theme._title;
				theme._properties = req.body._properties ? req.body._properties : theme._properties;

				theme.save(function (err, theme) {
					if (err) {
						return res.status(500).json({
							message: 'Error when updating theme.',
							error: err
						});
					}

					return res.json(theme);
				});
			}
		});
	},

	/**
	 * themeController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		themedocModel.findByIdAndRemove(id, function (err, theme) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the theme.',
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
			themedocModel.paginate(
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
