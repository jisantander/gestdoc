'use strict';

const usergroupModel = require('../models/usergroupModel.js');

/**
 * usergroupController.js
 *
 * @description :: Server-side logic for managing usergroups.
 */
module.exports = {
	/**
	 * usergroupController.list()
	 */
	list: function (req, res) {
		usergroupModel.find(function (err, usergroups) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting usergroup.',
					error: err
				});
			}
			return res.json(usergroups);
		});
	},

	/**
	 * usergroupController.show()
	 */
	show: function (req, res) {
		var id = req.params.id;
		usergroupModel.findOne({ _id: id }, function (err, usergroup) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting usergroup.',
					error: err
				});
			}
			if (!usergroup) {
				return res.status(404).json({
					message: 'No such usergroup'
				});
			}
			return res.json(usergroup);
		});
	},

	/**
	 * usergroupController.create()
	 */
	create: function (req, res) {
		var usergroup = new usergroupModel({
			_usergroupName: req.body._usergroupName
		});

		usergroup.save(function (err, usergroup) {
			if (err) {
				return res.status(500).json({
					message: 'Error when creating usergroup',
					error: err
				});
			}
			return res.status(201).json(usergroup);
		});
	},

	/**
	 * usergroupController.update()
	 */
	update: function (req, res) {
		var id = req.params.id;
		usergroupModel.findOne({ _id: id }, function (err, usergroup) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting usergroup',
					error: err
				});
			}
			if (!usergroup) {
				return res.status(404).json({
					message: 'No such usergroup'
				});
			}

			usergroup._usergroupName = req.body._usergroupName ? req.body._usergroupName : usergroup._usergroupName;

			usergroup.save(function (err, usergroup) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating usergroup.',
						error: err
					});
				}

				return res.json(usergroup);
			});
		});
	},

	/**
	 * usergroupController.remove()
	 */
	remove: function (req, res) {
		var id = req.params.id;
		usergroupModel.findByIdAndRemove(id, function (err, usergroup) {
			if (err) {
				return res.status(500).json({
					message: 'Error when deleting the usergroup.',
					error: err
				});
			}
			return res.status(204).json();
		});
	}
};
