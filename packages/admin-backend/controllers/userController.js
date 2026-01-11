'use strict';

var fs = require('fs');
var path = require('path');
var User = require('../models/userModel');
var companyModel = require('../models/companyModel');
var jwt = require('../services/jwt');
var sendmail = require('../services/sendmail');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var moment = require('moment');
const googleAuth = require('../lib/googleAuth');
const axios = require('axios');

const mail = require('../lib/mail');

function saveUser(req, res) {
	var user = new User();
	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email.toLowerCase();
	user.role = params.role ? params.role : 'ROLE_ADMIN';
	user.image = 'null';
	user.password = params.password;
	user.group = params.group || [];
	user.company = req.user.company;

	if (user.name == null || user.surname == null || user.email == null || params.password == null) {
		return res.status(200).send({ message: 'Introduzca todos los datos' });
	}

	user.save(async (err, userStored) => {
		if (err) {
			res.status(500).send({ message: 'Error al guardar el usuario' });
			return;
		}
		if (!userStored) {
			res.status(404).send({ message: 'No se ha registrado el usuario' });
		} else {
			let companyData = {};
			if (userData.company) companyData = await companyModel.findOne({ _id: user.company });
			res.status(200).send({ user: userStored, companyData });
		}
	});
}

function loginUser(req, res) {
	var params = req.body;
	var email = params.email;
	var password = params.password;

	if (email == null || password == null) {
		res.status(200).send({ message: 'Parámetros incompletos' });
		return;
	}

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err) {
			res.status(500).send({ message: 'Error en la petición' });
			return;
		}
		if (!user) {
			res.status(401).send({ message: 'Login inválido' });
			return;
		}
		user.comparePassword(password, async function (err, check) {
			if (check) {
				const {
					_doc: { password, ...userData }
				} = user;
				let companyData = {};
				if (userData.company) companyData = await companyModel.findOne({ _id: user.company });

				res.status(200).send({
					token: jwt.createToken(userData),
					user: {
						...userData,
						companyData
					}
				});
			} else {
				res.status(401).send({ message: 'Login inválido' });
			}
		});
	});
}

const verifyPassword = (email, password) => {
	return new Promise((resolve, reject) => {
		User.findOne({ email: email.toLowerCase() }, (err, user) => {
			if (err) {
				reject(err);
			}
			if (!user) {
				return reject('El usuario no existe');
			}
			user.comparePassword(password, function (err, check) {
				if (check) {
					resolve(true);
				} else {
					reject('Contraseña incorrecta');
				}
			});
		});
	});
};

function updateUser(req, res) {
	var userId = req.params.id;
	//var update = req.body;
	var name = req.body.name;
	var surname = req.body.surname;
	var email = req.body.email;
	var password = req.body.password;
	var role = req.body.role;
	//var image = req.body.image;

	var groupList = req.body.group;

	User.findOne({ _id: userId }, function (err, user) {
		if (err) {
			return res.status(500).json({
				message: 'Error when getting user',
				error: err
			});
		}
		if (!user) {
			return res.status(404).json({
				message: 'No such user'
			});
		}

		if (groupList) {
			var group = [];
			for (var i = 0; i < groupList.length; i++) {
				var groupId = groupList[i]; //mongoose.Types.ObjectId(groupList[i]);
				group.push(groupId);
			}
			user.markModified('group');
		}

		user.name = name ? name : user.name;
		user.surname = surname ? surname : user.surname;
		user.email = email ? email : user.email;
		user.password = password ? password : user.password;
		user.role = role ? role : user.role;
		//user.image = image ? image : user.image;
		user.group = group ? group : user.group;

		user.save(function (err, userUpdated) {
			if (err) {
				return res.status(500).json({
					message: 'Error when updating user.',
					error: err
				});
			} else {
				if (!userUpdated) {
					res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
				} else {
					res.status(200).send({ user: userUpdated });
				}
			}
		});
	});
}

function passwordResetRequest(req, res) {
	var params = req.body;
	var email = params.email;
	var tokenMinutesAlive = 30; // 30 min

	if (email == null) {
		res.status(200).send({ message: 'Parámetros incompletos' });
		return;
	}

	async.waterfall(
		[
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function (token, done) {
				User.findOne({ email: email }, function (err, user) {
					if (!user) {
						return res.status(404).send({ message: 'Usuario no encontrado' });
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + tokenMinutesAlive * 1000 * 60;

					user.save(function (err) {
						done(err, token, user);
					});
				});
			},
			async function (token, user, done) {
				try {
					await mail.email_generic({
						from: 'contacto@gestdoc.cl',
						to: user.email,
						subject: 'Reestablecer contraseña',
						html:
							'Hola ' +
							user.name +
							',<br />' +
							'Estás recibiendo este mensaje porque tú (o alguien más) ha solicitado restablecer la contraseña para tu cuenta.<br /><br />' +
							'Haz clic en el siguiente enlace, o pégalo en el navegador para completar el proceso:<br />' +
							'http://' +
							req.headers.host +
							'/password-reset/' +
							token +
							'<br /><br />' +
							'Si no solicitaste restablecer tu contraseña, sólo ignora este mensaje y tu contraseña no será cambiada.<br />' +
							'El enlace de recuperación será válido por un máximo de ' +
							tokenMinutesAlive +
							' minutos.<br />'
					});
				} catch (error) {
					console.error(error);
					throw 'Error al enviar email de token';
				}
				return 'Email para restablecimiento de contraseña enviado';
			}
		],
		function (err, result) {
			if (err) {
				return res.status(500).send({ message: err });
			} else {
				return res.status(200).send({ message: result });
			}
		}
	);
}

/**
 * TEMPORAL
 */
function sendProcessDone(req, res) {
	var params = req.body;
	var correo = 'jmsantos@resit.cl';
	var tokenMinutesAlive = 30; // 30 min

	if (correo == null) {
		res.status(200).send({ message: 'Parámetros incompletos' });
		return;
	}

	async.waterfall(
		[
			function (done) {
				crypto.randomBytes(20, function (err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function (token, done) {
				var email = {
					to: [correo],
					subject: 'Alzamiento Completado',
					text: 'Alzamiento completado',
					html:
						'Don José Santos Lara,<br />' +
						'Estás recibiendo este mensaje para informarte que el proceso de Alzamiento de tu propiedad ha concluido con éxito.<br /><br />' +
						'Puedes contactarte con Banco Estado para más información<br />' +
						'El número de operación asociado al proceso es el: 45456644<br />'
				};

				sendmail.sendMail(email, (err, msg) => {
					if (err) {
						err = 'Error al enviar email';
					}
					done(err, 'Email para enviado');
				});
			}
		],
		function (err, result) {
			if (err) {
				return res.status(500).send({ message: err });
			} else {
				return res.status(200).send({ message: result });
			}
		}
	);
}

function passwordResetCheckToken(req, res) {
	var token = req.params.token;
	User.findOne(
		{
			resetPasswordToken: token,
			resetPasswordExpires: { $lt: moment().add(2, 'hours').toDate() }
		},
		function (err, user) {
			if (!user) {
				return res.status(404).send({
					message: 'Token de restablecimiento de contraseña inválido'
				});
			} else {
				return res.status(200).send({ email: user.email, message: 'Token válido' });
			}
		}
	);
}

function passwordResetDo(req, res) {
	var token = req.params.token;
	var password = req.body.password;

	async.waterfall(
		[
			function (done) {
				User.findOne(
					{
						resetPasswordToken: token,
						resetPasswordExpires: { $lt: moment().add(2, 'hours').toDate() }
					},
					function (err, user) {
						if (!user) {
							return res.status(404).send({
								message: 'Token de restablecimiento de contraseña inválido'
							});
						}

						user.password = password;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function (err) {
							done(err, user);
						});
					}
				);
			},
			async function (user, done) {
				try {
					await mail.email_generic({
						from: 'contacto@gestdoc.cl',
						to: user.email,
						subject: 'Tu contraseña ha sido actualizada',
						html:
							'Hola ' +
							user.name +
							',<br />' +
							'Estás recibiendo este mensaje porque tú (o alguien más) ha reestablecido la contraseña para tu cuenta.<br /><br />' +
							'Si no solicitaste restablecer tu contraseña, puedes recuperarla desde nuestra plataforma.<br />'
					});
				} catch (error) {
					console.error(error);
					throw 'Error al enviar email de token';
				}
				return 'Email para restablecimiento de contraseña enviado';
			}
		],
		function (err, result) {
			if (err) {
				res.status(500).send({ message: err });
			} else {
				res.status(200).send({ message: result });
			}
		}
	);
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name_position = file_split.length - 1;
		var file_name = file_split[file_name_position];
		var ext_split = file_name.split('.');
		var file_ext = ext_split[ext_split.length - 1];

		var allowed_ext = ['jpg', 'png', 'gif'];

		if (allowed_ext.indexOf(file_ext.toLowerCase()) >= 0) {
			User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
				if (err) {
					res.status(500).send({ message: 'Error al actualizar el usuario' });
				} else {
					if (!userUpdated) {
						res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
					} else {
						res.status(200).send({ image: file_name, user: userUpdated });
					}
				}
			});
		} else {
			res.status(200).send({ message: 'Extensión inválida' });
		}
	} else {
		res.status(200).send({ message: 'Imagen no subida' });
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	var pathFile = './uploads/users/' + imageFile;
	var pathDefaultFile = './uploads/users/avatar.png';

	fs.exists(pathFile, function (exists) {
		if (exists) {
			res.sendFile(path.resolve(pathFile));
		} else {
			res.sendFile(path.resolve(pathDefaultFile));
		}
	});
}

/*
async function google_auth(req, res) {
	debugger
	try {

		const { data: response } = await axios.post(
			`${GESTDOC_URL}api/auth/google`,req.body
		);
		debugger
		console.log(response);
		resolve(response);

		const { token } = req.body;
		console.log('req.body', req.body)
		//	const data = jwt.verifyToken(token);
		res.json({
			message: 'User succesfully logged!'
		});
	} catch (err) {
		console.error('[Login]', err);
		next(err);
	}
}
*/

async function google_auth(req, res) {
	try {
		const googleVerification = await googleAuth(req.body.tokenId);
		console.log('googleVerification', googleVerification);

		if (!googleVerification) {
			res.json({
				message: 'token invalido'
			});
		}
		User.findOne({ email: googleVerification.email })
			.exec()
			.then(async (usuario) => {
				if (!usuario) {
					googleVerification.status = true;
					const usuario = new userModel(googleVerification);
					usuario
						.save()
						.then(async (result) => {
							res.json({
								email: result.email,
								name: result.name,
								surname: result.surname,
								picture: result.picture,
								token: await jwt.createToken({
									_id: result._id,
									email: result.email,
									name: result.name,
									surname: result.surname
								})
							});
						})
						.catch((err) => {
							return res.status(404).json({
								message: 'no se pudo crear el usuario'
							});
						});
				} else {
					console.log('usuario', usuario);
					debugger;
					User.findOne({ email: usuario.email })
						.exec()
						.then(async (usuario) => {
							let companyData = {};
							if (userData.company) companyData = await companyModel.findOne({ _id: user.company });

							return res.status(200).send({
								token: jwt.createToken(usuario),
								user: usuario,
								companyData
							});
						})
						.catch((err) => {
							console.log(err);
							return res.status(404).json({
								message: 'error en el usuario'
							});
						});
				}
			});
	} catch (err) {
		console.error('[Login]', err);
		next(err);
	}
}

async function verifyUser(req, res) {
	try {
		const { token } = req.body;
		const data = jwt.verifyToken(token);

		User.findOne({ email: data.email }, async (err, user) => {
			if (err) {
				res.status(500).send({ message: 'Error en la petición' });
				return;
			}
			if (!user) {
				res.status(401).send({ message: 'Login inválido' });
				return;
			}

			const {
				_doc: { password, ...userData }
			} = user;
			let companyData = {};
			if (userData.company) companyData = await companyModel.findOne({ _id: user.company });

			res.status(200).json({
				message: 'User succesfully logged!',
				token: jwt.createToken(userData),
				companyData,
				...userData
			});
		});
	} catch (err) {
		console.error('[Login]', err);
		next(err);
	}
}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	passwordResetRequest,
	passwordResetCheckToken,
	passwordResetDo,
	uploadImage,
	getImageFile,
	sendProcessDone,
	verifyUser,
	google_auth,
	verifyPassword
};
