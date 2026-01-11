var express = require('express');
const XlsxPopulate = require('xlsx-populate');
const moment = require('moment');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');
const ObjectId = require('mongoose').Types.ObjectId;

var bpmnController = require('../controllers/bpmnController');
var usersController = require('../controllers/usersController');
var md_auth = require('../middlewares/authenticate');
const bpmnModel = require('../models/bpmnModel');
const procedureModel = require('../models/procedureModel');
const formModel = require('../models/formsModel');
const urlModel = require('../models/urlModel');
const { getStepsProcedure, getCurrentFlow, getParticipants } = require('../lib/bpmnExtra');
const asyncForEach = require('../lib/asyncForEach.js');

const multer = require('multer');
const storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	}
});
const upload = multer({ storage }).single('file');

var router = express.Router();

/*
 * GET
 */
router.get('/', md_auth.ensureAuth, async (req, res, next) => {
	try {
		let filter = req.query.filter ? req.query.filter : { company: req.user.company };
		if (typeof filter === 'string') {
			filter = JSON.parse(filter);
			if (filter._nameSchema) {
				filter._nameSchema = { $regex: filter._nameSchema, $options: 'i' };
			}
		}
		filter.company = req.user.company;
		const items = await bpmnController.find({
			page: req.query.page && parseInt(req.query.page),
			limit: req.query.limit && parseInt(req.query.limit),
			filter: filter
		});
		res.json(items);
	} catch (err) {
		console.error(err.response);
		next(err);
	}
});

/*
 * GET
 */
router.get('/all', md_auth.ensureAuth, bpmnController.showAll);
/*
 * GET
 */
router.get('/gestor', bpmnController.getGestores);

/*
 * GET
 */
router.get('/:id', bpmnController.show);

/*
 * POST
 */
router.post('/', md_auth.ensureAuth, bpmnController.create);

/*
 * POST GET STEPS
 * Función para obtener los pasos o procedimientos del BPMN
 */
router.post('/steps/:id', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const procedure = await bpmnModel.findById(req.params.id);
		const steps = await getStepsProcedure(procedure._bpmnModeler, true);
		res.json(steps);
	} catch (err) {
		console.error('[bpmn steps]', err);
		next(err);
	}
});

router.post('/quick', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const bpmnId = req.body.id;
		const bpmn = await bpmnModel.findById(bpmnId);
		if(!bpmn)
			return res.status(404).json({ error: "BPMN not found" });
		if(bpmn.quick){
			const url = await urlModel.findById(bpmn.quick);
			if(!url)
				return res.status(404).json({ error: "URL not found" });
			return res.json({
				url: url.shortUrl
			});
		}else{
			let shortCode = shortid();
			shortCode = `Q${moment().format('yyyyMM')}${shortCode}`;
			let URL_BASE = process.env.GESTDOC_URL;
			if (URL_BASE.substr(-1) === '/') {
				URL_BASE = URL_BASE.substr(0, URL_BASE.length - 1);
				console.log({ URL_BASE });
			}
			const urlResult = await urlModel.create({
				shortUrl: `${URL_BASE}/q/${shortCode}`,
				longUrl: `${URL_BASE}/quick/${bpmnId}`,
				rxsUrl: `/quick/${bpmnId}`,
				urlCode: shortCode,
				clickCount: 0
			});
			const updateBpmn = function(id, quick){
				return new Promise((resolve, reject) => {
					bpmnModel.findOne({ _id: id }, (err, data) => {
						if (err) {
							console.error(err);
							return reject(err);
						}
						bpmnModel
							.update(
								{ _id: data._id },
								{
									$set: { quick: quick }
								}
							)
							.exec()
							.then(() => {
								resolve(true);
							})
							.catch((err) => {
								console.error(err);
								reject(err);
							});
					});
				});
			};
			await updateBpmn(bpmnId, urlResult._id);
			res.json({
				url: `${URL_BASE}/q/${shortCode}`
			});
		}
	}catch(err){
		console.error(err);
		next(err);
	}
});

/*
 * POST DOWNLOAD XLS
 * Función para descargar Excel plantilla
 * @params id
 * @params step
 */
router.post('/xls/:id/:step', md_auth.ensureAuth, async (req, res, next) => {
	try {
		const bpmn = await bpmnModel.findById(req.params.id);
		const data = req.body;
		if (data.type === 'form') {
			const form = await formModel.findById(data.form);
			data.json = form;
		}
		const [currentFlow, isFirst] = await getCurrentFlow(bpmn._bpmnModeler, req.params.step);
		let participants = [];
		let users = [];
		if (isFirst) {
			participants = await getParticipants(bpmn._bpmnModeler);
		}
		/* Obtenemos los procedimientos que pueden actualizarse */
		const procedures = await procedureModel.findCurrentFlow(bpmn._id, currentFlow);
		XlsxPopulate.fromFileAsync('templates/upload.xlsx')
			.then(async (workbook) => {
				workbook.sheet(0).cell('C2').value(bpmn._nameSchema);
				workbook.sheet(0).cell('E2').value(req.params.id);
				workbook.sheet(0).cell('C3').value(data.json._title);
				workbook.sheet(0).cell('E3').value(req.params.step);
				workbook.sheet(0).cell('E4').value(currentFlow);
				workbook.sheet(0).cell('F4').value('.');
				workbook.sheet(0).cell('C4').value(moment().format('YYYY-MM-DD HH:mm:ss'));
				if (data.type === 'form') {
					const fieldsData = JSON.parse(data.json._stringJson);
					let cont = 0;
					const firstColumn = 'C';
					const row = 8;
					if (isFirst) {
						await asyncForEach(participants, async (item, i) => {
							const column = String.fromCharCode(firstColumn.charCodeAt() + cont);
							workbook
								.sheet(0)
								.cell(column + row)
								.value(item.name);
							cont++;
						});
						users = await usersController.showAll();
					}
					for (var i in fieldsData.properties) {
						const column = String.fromCharCode(firstColumn.charCodeAt() + cont);
						workbook
							.sheet(0)
							.cell(column + row)
							.value(fieldsData.properties[i].title);
						workbook
							.sheet(0)
							.cell(column + (row - 1))
							.value(i);
						workbook
							.sheet(0)
							.cell(column + (row - 2))
							.value(fieldsData.properties[i].format);
						cont++;
					}
					if (procedures.length > 0) {
						await asyncForEach(procedures, async (item, i) => {
							await workbook
								.sheet(0)
								.cell('A' + (row + 1 + i))
								.value(item._id + '');
							await workbook
								.sheet(0)
								.cell('B' + (row + 1 + i))
								.value(item.sequence + '');
							if (isFirst) {
								await asyncForEach(participants, async (itemP, i2) => {
									const column = String.fromCharCode(firstColumn.charCodeAt() + i2);
									const gestor = item.gestores.find((it) => it.id === itemP.id);
									const user = users.find((it) => it._id == gestor.user);
									if (user) {
										workbook
											.sheet(0)
											.cell(column + (row + 1 + i))
											.value(user.email);
									}
								});
							}
						});
					}
				}
				return workbook.outputAsync();
			})
			.then((data) => {
				/* Devolvemos excel con data llenada */
				res.attachment('plantilla.xlsx');
				res.send(data);
			})
			.catch((err) => {
				throw err;
			});
	} catch (err) {
		console.error('[bpmn xls]', err);
		next(err);
	}
});

/*
 * POST READ XLS
 * Función para leer Excel plantilla
 */
router.post('/read', md_auth.ensureAuth, upload, async (req, res, next) => {
	try {
		const workSheetsFromBuffer = xlsx.parse(req.files.file.data);
		const rpta = [];
		const columns = [];
		const ids = [];
		const formats = [];
		let bpmnId = '';
		let titleStage = '';
		let currentFlow = '';
		let bpmnSteps = {};
		let isFirst = false;
		let columnStart = 2;
		const users = await usersController.showAll();
		const possibleErrors = [];
		await asyncForEach(workSheetsFromBuffer[0].data, async (row, i) => {
			try {
				if (i === 1) {
					titleStage = row[1];
					bpmnId = row[3];
					if (!ObjectId.isValid(bpmnId)) {
						titleStage = row[2];
						bpmnId = row[4];
					}
					const bpmn = await bpmnModel.findById(bpmnId);
					bpmnSteps = await getStepsProcedure(bpmn._bpmnModeler);
				}
				if (i === 3) {
					currentFlow = row[3];
					if (currentFlow === 'Current') currentFlow = row[4];
					await asyncForEach(bpmnSteps, async (participant) => {
						if (participant.start === currentFlow) isFirst = true;
					});
					/*if (isFirst) {
						columnStart += bpmnSteps.length;
					}*/
				}
				if (i === 5) {
					for (var cont = columnStart; cont < row.length; cont++) {
						formats.push(row[cont]);
					}
				}
				if (i === 6) {
					if (row[columnStart] === undefined) {
						columnStart += bpmnSteps.length;
					} else if (row[columnStart] === null) {
						columnStart += bpmnSteps.length;
					} else if (row[columnStart] === false) {
						columnStart += bpmnSteps.length;
					}
					for (var cont = columnStart; cont < row.length; cont++) {
						ids.push(row[cont]);
					}
				}
				if (i === 7) {
					for (var cont = columnStart; cont < row.length; cont++) {
						columns.push(row[cont]);
					}
				}
				if (i > 7) {
					if (row[0] !== '') {
						const dataProce = {
							current: currentFlow,
							name: '-',
							status: 'pending',
							data: {
								form: {},
								form_names: {},
								form_types: {},
								titleStage: titleStage,
								type: 'form'
							}
						};
						if (row[0] === undefined || row[0].toUpperCase() === 'NEW') {
							dataProce.id = 'NEW';
							dataProce.bpmn = bpmnId;
							dataProce.participants = [];
							await asyncForEach(bpmnSteps, async (participant, iP) => {
								let user = users.find((itU) => {
									if (isNaN(row[1 + iP]) && row[1 + iP] !== 'NEW') return itU.email === row[1 + iP];
									else return itU.email === row[2 + iP];
								});
								if (!user)
									return possibleErrors.push({
										index: i,
										data: row,
										message: 'Usuario no encontrado'
									});
								dataProce.participants.push({
									id: participant.id,
									user: user._id
								});
							});
						} else {
							dataProce.id = row[0];
							dataProce.name = row[1];
						}
						for (var i = columnStart; i < row.length; i++) {
							dataProce.data.form[ids[i - columnStart]] = row[i];
							dataProce.data.form_names[ids[i - columnStart]] = columns[i - columnStart];
							if (ids[i - columnStart].includes('fecha')) {
								dataProce.data.form[ids[i - columnStart]] = moment(
									new Date(Math.round((row[i] - 25569) * 86400 * 1000))
								).format('YYYY-MM-DD');
							}
						}
						rpta.push(dataProce);
					}
				}
			} catch (e) {
				console.error(e);
				possibleErrors.push({ index: i, data: row });
			}
		});
		if (possibleErrors.length > 0) {
			return res.status(500).json({
				message: 'Hubo un error en los siguientes procedimientos',
				data: possibleErrors
			});
		}
		res.json({ data: rpta });
	} catch (e) {
		res.status(500).json({
			message: 'Hubo un error en la subida'
		});
	}
});

/*
 * PUT
 */
router.put('/:id', bpmnController.update);

/*
 * DELETE
 */
router.delete('/:id', bpmnController.remove);

module.exports = router;
