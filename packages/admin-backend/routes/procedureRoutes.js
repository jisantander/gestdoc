const express = require('express');
const router = express.Router();
const moment = require('moment');
const XlsxPopulate = require('xlsx-populate');
const axios = require('axios');

const modelCompany = require('../models/companyModel');
const md_auth = require('../middlewares/authenticate');
const controller = require('../controllers/operationController');
const modelProcedure = require('../models/procedureModel');
const modelTrash = require('../models/trashModel');
const UsersController = require('../controllers/usersController');
const { calculateDueDate, calculateDueDateMass } = require('../lib/bpmnDue');
const asyncForEach = require('../lib/asyncForEach');

const parseFilter = (filter, req) => {
	if (req.user.company) {
		filter.company = req.user.company;
	}
	if (req.user.role == 'VISITOR') {
		filter.user = req.user.sub;
	}
	if (filter.user === '-') {
		delete filter.user;
	}
	if (filter.bpmn === '-') {
		delete filter.bpmn;
	}
	if (filter.sequence === '') {
		delete filter.sequence;
	} else {
		if (filter.sequence.length === 24) {
			const valueToLook = filter.sequence;
			if (isNaN(valueToLook)) {
				filter._id = valueToLook;
			} else {
				filter['$or'] = [{ sequence: valueToLook }, { _id: valueToLook }];
			}
			delete filter.sequence;
		}
	}
	if (filter.step) {
		if (filter.step !== '-') {
			filter['gestores.current'] = filter.step;
		}
		delete filter.step;
	}
	if (filter.ended !== undefined) {
		if (filter.ended === 'P') filter['gestores.current'] = { $ne: 'HAS_ENDED' };
		else if (filter.ended === 'F') filter['gestores.current'] = 'HAS_ENDED';
		delete filter.ended;
	}
	if (filter.due !== undefined) {
		if (filter.due !== '-') {
			filter['gestores.current'] = {
				$ne: 'HAS_ENDED'
			};
		}
		if (filter.due === 'R') {
			filter['gestores.due_date'] = {
				$lte: moment().toDate()
			};
		}
		if (filter.due === 'O') {
			filter['gestores.due_date'] = {
				$lte: moment().add(3, 'days').toDate(),
				$gte: moment().toDate()
			};
		}
		if (filter.due === 'V') {
			filter['gestores.due_date'] = {
				$gt: moment().add(3, 'days').toDate()
			};
		}
		delete filter.due;
	}
	if (filter.since !== undefined) {
		if (filter.since !== '' && filter.since !== '-' && filter.since !== null && typeof filter.since !== 'object') {
			filter['createdAt'] = {
				$gte: moment(filter.since).toDate()
			};
		}
	}
	if (filter.updated !== undefined) {
		if (
			filter.updated !== '' &&
			filter.updated !== '-' &&
			filter.updated !== null &&
			typeof filter.updated !== 'object'
		) {
			filter['updatedAt'] = {
				$gte: moment(filter.updated).toDate()
			};
		}
	}
	delete filter.since;
	delete filter.updated;
	delete filter.page;
	delete filter.limit;
	if (filter.form) {
		if (filter.form.length > 0) {
			filter.form.forEach((item) => {
				if (item[1] !== '') {
					if (isNaN(item[1])) {
						filter[`gestores.form.${item[0]}`] = {
							$regex: item[1],
							$options: 'i'
						};
					} else {
						filter['$or'] = [
							{
								[`gestores.form.${item[0]}`]: {
									$regex: item[1],
									$options: 'i'
								}
							},
							{ [`gestores.form.${item[0]}`]: parseInt(item[1]) }
						];
					}
				}
			});
		}
		delete filter.form;
	}

	return filter;
};

/*
 * GET
 */
router.get('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const filter = parseFilter(JSON.parse(req.query.filter), req);
		//si el usuario tiene company de nombre gestdocexpress y rol visitor en filter hay que agregar filtrar por el mismo siempre.
		const procedures = await modelProcedure.find({
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit),
			filter: filter
		});
		let dates = {};
		if (req.query.due) {
			dates = await calculateDueDateMass(procedures.docs);
		}
		procedures.dates = dates;
		res.json(procedures);
	} catch (err) {
		console.error('[list procedure]', err, req.query);
		next(err);
	}
});

/*
 * GET
 */
router.get('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const promise1 = modelProcedure.getDocumento(req.params.id);
		const promise2 = UsersController.showAll();
		const [procedure, users] = await Promise.all([promise1, promise2]);
		let dates = {};
		if (req.query.due) {
			dates = await calculateDueDate(procedure.bpmn, procedure);
		}
		res.json({ users, ...procedure, dates });
	} catch (err) {
		console.error('[get procedure]', err);
		next(err);
	}
});

router.get('/xls/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const procedimiento = await modelProcedure.getDocumento(req.params.id);
		XlsxPopulate.fromFileAsync('templates/procedure_info.xlsx')
			.then(async (workbook) => {
				workbook.sheet(0).cell('C2').value(procedimiento.sequence);
				workbook.sheet(0).cell('C3').value(procedimiento.documento._nameSchema);
				workbook.sheet(0).cell('C4').value(moment().format('DD/MM/YYYY HH:mm:ss'));
				let row = 6;
				await asyncForEach(procedimiento.gestores, async (gestor) => {
					// prettier-ignore
					workbook.sheet(0).cell('B' + row).value('Gestor (Participante)');
					// prettier-ignore
					workbook.sheet(0).cell('C' + row).value(gestor.name);
					row++;
					// prettier-ignore
					workbook.sheet(0).cell('B' + row).value('Código de participante');
					// prettier-ignore
					workbook.sheet(0).cell('C' + row).value(gestor.id);
					row++;
					// prettier-ignore
					workbook.sheet(0).cell('B' + row).value('Fecha de vencimiento');
					// prettier-ignore
					workbook.sheet(0).cell('C' + row).value(gestor.due_date);
					row++;
					row++;
					for (var key in gestor.history) {
						const history = gestor.history[key];
						// prettier-ignore
						workbook.sheet(0).cell('B' + row).value('Título de la etapa:');
						// prettier-ignore
						workbook.sheet(0).cell('C' + row).value(history.titleStage);
						row++;
						// prettier-ignore
						workbook.sheet(0).cell('B' + row).value('Tipo de procedimiento:');
						// prettier-ignore
						workbook.sheet(0).cell('C' + row).value(history.type);
						// prettier-ignore
						workbook.sheet(0).cell('D' + row).value('Realizado el:');
						// prettier-ignore
						workbook.sheet(0).cell('E' + row).value(moment(history.writeAt).format('DD/MM/YYYY HH:mm:ss'));
						row++;
						row++;
						switch (history.type) {
							case 'charge':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('Cobro realizado en Flow por:');
								// prettier-ignore
								workbook.sheet(0).cell('C' + row).value(history.amount);
								break;
							case 'form':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('Formulario:');
								// prettier-ignore
								workbook.sheet(0).cell('C' + row).value(history.titleStage);
								const fields = Object.keys(history.form_names);
								fields.forEach((field) => {
									row++;
									// prettier-ignore
									workbook.sheet(0).cell('B' + row).value(history.form_names[field]);
									// prettier-ignore
									workbook.sheet(0).cell('C' + row).value(history.form[field]);
								});
								break;
							case 'email':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('ENVÍO DE CORREO ELECTRÓNICO');
								break;
							case 'doc':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('REVISIÓN DE DOCUMENTO');
								break;
							case 'advance_signature':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('FIRMA AVANZADA VALIDADA');
								break;
							case 'request_signature':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('Correo');
								// prettier-ignore
								workbook.sheet(0).cell('C' + row).value('RUT');
								// prettier-ignore
								workbook.sheet(0).cell('D' + row).value('Nombre');
								// prettier-ignore
								workbook.sheet(0).cell('E' + row).value('Apellido');
								history.people.forEach((people) => {
									row++;
									// prettier-ignore
									workbook.sheet(0).cell('B' + row).value(people.email);
									// prettier-ignore
									workbook.sheet(0).cell('C' + row).value(people.rut);
									// prettier-ignore
									workbook.sheet(0).cell('D' + row).value(people.nombre);
									// prettier-ignore
									workbook.sheet(0).cell('E' + row).value(people.apellido);
								});
								break;
							case 'signature':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('FIRMA VALIDADA');
								break;
							case 'view_collaborations':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('ETAPA DE VISUALIZACIÓN DE PARTICIPANTES');
								break;
							case 'sign_in':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('Usuario válido');
								// prettier-ignore
								workbook.sheet(0).cell('C' + row).value(history.value);
								break;
							case 'END':
								// prettier-ignore
								workbook.sheet(0).cell('B' + row).value('FINALIZACIÓN DE PROCEDIMIENTO');
								break;
						}
						row++;
						row++;
					}
				});
				return workbook.outputAsync();
			})
			.then((data) => {
				/* Devolvemos excel con data llenada */
				res.attachment('procedimiento.xlsx');
				res.send(data);
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		console.error('[get procedure]', err.response);
		next(err);
	}
});

/*
 * POST Download
 */
router.post('/download', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const filter = parseFilter(req.body.filter, req);
		const ids = await modelProcedure.findField(
			filter,
			['_id', 'ecert', 'gestores', 'sequence', 'bpmn'],
			['_nameSchema', 'download']
		);
		const getBpmnName = (procedure) => {
			if (procedure.bpmn.download) {
				let downloadName = procedure.bpmn.download;
				procedure.gestores.forEach((gestor) => {
					if (gestor.form) {
						for (let variable of Object.keys(gestor.form)) {
							downloadName = downloadName.replace(`{${variable}}`, gestor.form[variable]);
						}
					}
				});
				return downloadName + '.pdf';
			}
			return procedure.bpmn._nameSchema + ' ' + procedure.sequence + '.pdf';
		};
		const hasDoc = (procedure) => {
			let has = false;
			procedure.gestores.forEach((gestor) => {
				if (gestor.history) {
					for (let phase of Object.keys(gestor.history)) {
						if (gestor.history[phase].type === 'doc') {
							has = gestor.history[phase];
							break;
						}
					}
				}
			});
			return has;
		};
		const files2Get = ids
			.map(({ _doc }) => {
				const hasDocument = hasDoc(_doc);
				if (_doc.ecert) {
					if (_doc.ecert.length > 0) {
						return { path: _doc.ecert[0].filePath, name: getBpmnName(_doc) };
					}
				} else if (_doc.upload) {
					return { path: _doc.upload, name: getBpmnName(_doc) };
				} else if (_doc.signatures) {
					if (_doc.signatures.length > 1) {
						return { path: `${_doc._id}.pdf`, name: getBpmnName(_doc) };
					} else {
						return '';
					}
				} else if (!_doc.gestores[0].history) {
					return '';
				} else if (hasDocument) {
					return { path: `${_doc._id}-${hasDocument.value}.pdf`, name: getBpmnName(_doc) };
				}
				return '';
			})
			.filter((it) => it !== '');
		if (files2Get.length === 0) {
			return next('No hay archivos para descargar');
		}
		//console.log({ files2Get });
		axios
			.post(
				'https://download.gestdoc.cl',
				{
					email: req.body.email,
					name: 'gestdoc',
					files: files2Get
				},
				{
					responseType: 'stream'
				}
			)
			.then((response) => {
				if (response.headers['content-type'] === 'application/zip') {
					res.setHeader('Content-Type', 'application/zip');
					response.data.pipe(res);
				} else {
					var bufs = [];
					response.data.on('data', function (d) {
						bufs.push(d);
					});
					response.data.on('end', function () {
						var buffer = Buffer.concat(bufs);
						var textdata = buffer.toString();
						return res.json(textdata);
					});
				}
			})
			.catch((err) => {
				let errMessage = err?.response?.data?.message || err?.response?.statusText || err?.message || err;
				console.error(errMessage);
				next(errMessage);
			});
	} catch (err) {
		//console.error(err?.response || err);
		next(err?.response?.data || err);
	}
});

/*
 * POST
 */
router.post('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const procedure = await modelProcedure.createDocumento({
			...req.body,
			email: req.user.email,
			user: req.user.sub,
			company: req.user.company
		});
		res.json(procedure);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

/*
 * PUT
 */
router.put('/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let data = { ...req.body.data };
		let current = req.body.current;
		//if (process.env.NODE_ENV === 'development') console.log(req.body);
		const nextStage = await controller.updateDocument(req.params.id, current, data);
		res.json(nextStage);
	} catch (err) {
		if (err.response) if (err.response.data) console.error(err.response.data);
		next(err);
	}
});

/*
 * PUT
 */
router.put('/back/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let { current, activity, participant, current_name, vence } = req.body;
		const data = await controller.backDocument(req.params.id, current, activity, participant, current_name, vence);
		res.json(data);
	} catch (err) {
		if (err.response) if (err.response.data) console.error(err.response.data);
		next(err);
	}
});

/*
 * DELETE
 */
router.delete('/:id', md_auth.ensureAuth, async (req, res) => {
	try {
		await modelProcedure.deleteDocument(req.params.id);
		res.json({ message: 'Documento eliminado' });
	} catch (err) {
		if (err.response) if (err.response.data) console.error(err.response.data);
		next(err);
	}
});
/*
 * DELETE ALL
 */
router.delete('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		if (!req.body.filter && !req.body.rows) return next('Falta filtro');
		let filter = { _id: { $in: req.body.rows } };
		if (req.body.filter) {
			filter = parseFilter(req.body.filter, req);
		}
		const documents = await modelProcedure.findAllDocuments(filter);
		await modelTrash.createMany(documents, req.user.sub);
		await modelProcedure.deleteAllDocuments(filter);
		res.json({ success: true, message: 'Documentos eliminados' });
	} catch (err) {
		console.error(err?.response?.data || err);
		next(err);
	}
});

/*
 * GET
 */
//router.get('/doc/:id', themedocController.getDoc);

router.use((err, req, res, next) => {
	res.status(500).json({ success: false, message: err });
});

module.exports = router;
