'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs').promises;
const noSyncfs = require('fs');
var historyModel = require('../models/historyModel.js');
var QRCode = require('qrcode');
var themedocModel = require('../models/themedocModel.js');
var formsModel = require('../models/formsModel.js');

const xml2js = require('../lib/xml2js');
const asyncForEach = require('../lib/asyncForEach');
var bpmnModel = require('../models/bpmnModel.js');
var proceduresModel = require('../models/procedureModel.js');

var mongoose = require('mongoose');
var async = require('async');
var AWS = require('aws-sdk');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
const axios = require('axios');

const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
	accessKeyId: S3_KEY,
	secretAccessKey: S3_SECRET,
	region: S3_REGION
});

var s3Bucket = new AWS.S3({ params: { Bucket: S3_BUCKET } });

const GESTDOC_URL = process.env.GESTDOC_URL || 'https://gestdocexpress.cl';

function resultTemplate(id_operation) {
	debugger;
	return new Promise((resolve, reject) => {
		proceduresModel.findOne({ _id: id_operation }, function (err, operation) {
			//busco los resultados de la operacion
			if (err) return reject(err);

			debugger;

			findDoc({ _id: operation.bpmn })
				.then((infoDoc) => {
					//busco algún doc asociado a la operación

					var s3 = new AWS.S3();
					const nameDocx = infoDoc.participants[0].doc._key; //string del nombre del doc
					const namePdf = infoDoc.participants[0].doc._key.replace('docx', 'pdf');
					var params = { Bucket: S3_BUCKET, Key: nameDocx };

					s3.getObject(params, async (err, file) => {
						if (err) {
							reject({ message: 'Archivo no encontrado en S3' });
						}
						try {
							const templateFile = file.Body;
							var resultForms = {};
							operation.gestores.forEach((element) => {
								resultForms = { ...resultForms, ...element.form };
							});

							var zip = new PizZip(templateFile);

							var doc2;

							try {
								doc2 = new Docxtemplater(zip);
							} catch (error) {
								errorHandler(error);
							}

							doc2.setData(resultForms);

							try {
								// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
								doc2.render();
							} catch (error) {
								// Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
								errorHandler(error);
							}

							var buf = doc2.getZip().generate({ type: 'nodebuffer' });

							await fs.writeFile(`${__dirname}/../unoconv/` + nameDocx, buf);
							var documents = { nameDocx, namePdf };
							resolve(documents);
						} catch (error) {
							reject({ message: 'No fue posible generar el archivo docx' });
						}
					});
				})
				.catch(function (e) {
					console.log('e', e);
					reject({ message: 'operación no encontrada' });
				});
		});
	});
}

function uploadFiles(operationId, files, maxUploads, done) {
	var uploadedFiles = [];
	// assuming files is an array of files
	async.eachLimit(
		files,
		maxUploads,
		function (file, callback) {
			// Perform operation on file here.
			var buf = new Buffer(
				file.data.replace(/^data:image\/\w+;base64,/, '').replace(/^data:application\/\w+;base64,/, ''),
				'base64'
			);
			var data = {
				Key: operationId + '/' + file.name,
				Body: buf,
				ContentEncoding: 'base64',
				ContentType: file.type
			};

			s3Bucket.putObject(data, function (err, data) {
				if (err) {
					callback(err);
				} else {
					uploadedFiles.push({ _filename: file.name });

					callback();
				}
			});
		},
		function (err) {
			// if any of the file processing produced an error, err would equal that error
			if (err) {
				// One of the iterations produced an error. All processing will now stop.
				done(err);
			} else {
				done(false, uploadedFiles);
			}
		}
	);
}

function getFilesList(period, callback) {
	//TODO: AQUI QUEDEEE TENGO QUE VER COMO SE ARMA LA LISTA !
	if (period.year && period.month) {
		var year = parseInt(period.year);
		var month = parseInt(period.month);
		var query = [
			{
				$match: { _doneAt: { $ne: null } }
			},
			{
				$group: { _id: '$_operationId', _date: { $min: '$_doneAt' } }
			},
			{
				$project: {
					_id: 1,
					_date: 1,
					month: { $month: '$_date' },
					year: { $year: '$_date' }
				}
			},
			{
				$match: { year: { $eq: year } }
			},
			{
				$match: { month: { $eq: month } }
			},
			{
				$lookup: {
					from: 'operations',
					localField: '_id',
					foreignField: '_id',
					as: '_op'
				}
			},
			{
				$unwind: '$_op'
			},
			{
				$match: { '_op._files': { $ne: [] } }
			},
			{
				$project: {
					_id: { _id: '$_id', _operationNumber: '$_op._data.numero_operacion' },
					_date: 1
				}
			},
			{
				$group: {
					_id: { month: { $month: '$_date' }, year: { $year: '$_date' } },
					_operations: { $push: '$_id' }
				}
			}
		];
		historyModel.aggregate(query).exec((err, fileslist) => {
			if (err) {
				callback(false);
			} else {
				callback(fileslist[0]._operations);
			}
		});
	} else {
		historyModel
			.aggregate([
				{
					$match: { _doneAt: { $ne: null } }
				},
				{
					$group: { _id: '$_operationId', _date: { $min: '$_doneAt' } }
				},
				{
					$lookup: {
						from: 'operations',
						localField: '_id',
						foreignField: '_id',
						as: '_op'
					}
				},
				{
					$unwind: '$_op'
				},
				{
					$match: { '_op._files': { $ne: [] } }
				},
				{
					$project: { _id: 1, _date: 1 }
				},
				{
					$group: {
						_id: { $year: '$_date' },
						months: { $addToSet: { $month: '$_date' } }
					}
				}
			])
			.exec((err, yearmonthslist) => {
				if (err) {
					callback(false);
				} else {
					callback(yearmonthslist);
				}
			});
	}
}

const formFindOne = (id) => {
	return new Promise((resolve, reject) => {
		formsModel.findById(id, (err, data) => {
			if (err) return reject(err);
			resolve({
				...data._doc
			});
		});
	});
};

const docFindOne = (id) => {
	return new Promise((resolve, reject) => {
		themedocModel.findById(id, (err, data) => {
			if (err) return reject(err);
			resolve({
				...data._doc
			});
		});
	});
};

const findDoc = async (id) => {
	debugger;
	const { _bpmnModeler, _requirements, ...documento } = await bpmnModel.findOne(id);
	const xmlBpmn = await xml2js(_bpmnModeler);
	const participants = [];
	await asyncForEach(xmlBpmn['bpmn:definitions']['bpmn:collaboration'][0]['bpmn:participant'], async (it) => {
		const partiData = it['$'];
		const processNode = xmlBpmn['bpmn:definitions']['bpmn:process'].find((itp) => {
			return itp['$'].id === partiData.processRef;
		});
		const formNode = processNode['bpmn:task'].find((itf) => {
			return itf['$']['custom:form'];
		});

		var formDoc = processNode['bpmn:task'].find((itf) => {
			return itf['$']['doc'];
		});

		var flag = false;
		if (typeof formDoc === 'undefined') {
			flag = true;
			formDoc = processNode['bpmn:task'].find((itf) => {
				return itf['$']['custom:doc'];
			});
		}

		debugger;
		if (typeof formNode != 'undefined') {
			partiData.form = await formFindOne(formNode['$']['custom:form']);
		}
		if (flag) {
			if (typeof formDoc != 'undefined') {
				partiData.doc = await docFindOne(formDoc['$']['custom:doc']);
			}
		} else {
			partiData.doc = await docFindOne(formDoc['$']['doc']);
		}
		participants.push(partiData);
	});
	return { _valor: 10000, participants, ...documento };
};

async function createPDF(nameDocx, namePdf) {
	await exec('unoconv -f pdf ' + `${__dirname}/../unoconv/` + nameDocx); //comando cmd para crear pdf
	return new Promise((resolve, reject) => {
		try {
			resolve({ namePdf, nameDocx });
		} catch (error) {
			reject({ message: 'No fue posible transformar a pdf', error });
		}
	});
}

function deleteFiles(namePdf, nameDocx) {
	//elimino el pdf del servidor
	fs.unlink(`${__dirname}/../unoconv/` + namePdf, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
	//elimino el docx del servidor
	fs.unlink(`${__dirname}/../unoconv/` + nameDocx, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
	if (value instanceof Error) {
		return Object.getOwnPropertyNames(value).reduce(function (error, key) {
			error[key] = value[key];
			return error;
		}, {});
	}
	return value;
}

function errorHandler(error) {
	console.log(JSON.stringify({ error: error }, replaceErrors));

	if (error.properties && error.properties.errors instanceof Array) {
		const errorMessages = error.properties.errors
			.map(function (error) {
				return error.properties.explanation;
			})
			.join('\n');
		console.log('errorMessages', errorMessages);
		// errorMessages is a humanly readable message looking like this :
		// 'The tag beginning with "foobar" is unopened'
	}
	throw error;
}

/**
 * operationController.js
 *
 * @description :: Server-side logic for managing operations.
 */
module.exports = {
	/**
	 * operationController.resultTemplate()
	 * ESTE METODO SOLO SIRVE PARA GESTDOCEXPRESS, POR QUE SUPONE QUE SOLO EXISTE UN DOCUMENTO IGUAL PARA TODOS,
	 * ENTONCES TOMA EL DOCUMENTO DEL PRIMER INTEGRANTE, NO FILTRA QUE INTEGRANTE Y QUE Tarea en especifico SE BUSCA
	 * ENTONCES
	 * */
	resultTemplateGestDocExpress: async function (req, res) {
		var id = req.params.id; // procedures_id
		try {
			var documents = await resultTemplate(id);
			await exec('unoconv -f pdf ' + `${__dirname}/../unoconv/` + documents.nameDocx); //comando cmd para crear pdf

			var file = noSyncfs.createReadStream(`${__dirname}/../unoconv/` + documents.namePdf);

			const params = {
				Bucket: S3_BUCKET,
				Key: `${id}.pdf`,
				Body: file
			};
			var s3 = new AWS.S3();
			s3.upload(params, (error, data) => {
				if (error) {
					res.status(500).send(error);
				}
				var file = noSyncfs.createReadStream(`${__dirname}/../unoconv/` + documents.namePdf);
				var stat = noSyncfs.statSync(`${__dirname}/../unoconv/` + documents.namePdf);
				res.setHeader('Content-Length', stat.size);
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader('Content-Disposition', 'inline; filename=' + documents.namePdf);
				file.pipe(res); // aquí se envía el archivo al cliente
				deleteFiles(documents.namePdf, documents.nameDocx);
			});
		} catch (error) {
			console.log('error', error);
			res.status(error);
			return res.send(error.message);
		}
	},

	docxQr: function (req, res) {
		var id = req.params.id; // procedures_id
		var s3 = new AWS.S3();
		var params = { Bucket: S3_BUCKET, Key: id + '.pdf' };

		s3.getObject(params, async (err, file) => {
			if (err) {
				reject({ message: 'Archivo no encontrado en S3' });
			}
			try {
				const existingPdfBytes = file.Body;

				// Load a PDFDocument from the existing PDF bytes
				const pdfDoc = await PDFDocument.load(existingPdfBytes);

				// Embed the Helvetica font

				// Get the first page of the document
				const pages = pdfDoc.getPages();
				const firstPage = pages[0];

				const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
				// Get the width and height of the first page
				const { width, height } = firstPage.getSize();

				const ticketId = 'http://gestdoc-express.herokuapp.com/signaturedoc/' + id;
				QRCode.toString(ticketId, {
					type: 'svg',
					version: 8,
					errorCorrectionLevel: 'H'
				}).then(async (out) => {
					// Draw the SVG path at 50% of its original size

					var svgresolve = out.split('stroke="#000000" d="');

					var svgresolve2 = svgresolve[1].split('"/></');
					pages[0].drawText('Firma Simple Gestdoc Express', {
						x: 20,
						y: 80,
						size: 11
					});

					pages[0].moveTo(10, pages[0].getHeight() - 5);
					pages[0].moveDown(600);
					pages[0].drawSvgPath(svgresolve2[0], { scale: 2.5 });

					// Serialize the PDFDocument to bytes (a Uint8Array)
					const pdfBytes = await pdfDoc.save();
					/*
                        res.writeHead(200, {
                            'Content-Type': mimetype,
                            'Content-disposition': 'attachment;filename=hola.pdf' ,
                            'Content-Length': pdfBytes.length
                        });
                        res.end(Buffer.from(pdfBytes, 'binary'));
                        */

					var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

					res.status(200);
					res.type('pdf');
					res.send(pdfBuffer);
				});
			} catch (error) {}
		});
		/*
               QRCode.toDataURL('http://gestdoc-express.herokuapp.com/', function (err, url) {
       
               })
       
               const ticketId = 'http://gestdoc-express.herokuapp.com/'
               QRCode.toString(ticketId, { type: 'svg', version: 5, errorCorrectionLevel: 'H' })
                   .then(out => {
                       console.log(out);
                       return res.send({ hola: out });
                   })
                   */
	},
	/**
	 * Funcion para actualizar el documento
	 * @param transaction <ObjectId> ID de la transacción
	 * @param data <Object> Información a ser actualizada
	 * @param current <String> Paso actual de la transacción
	 */
	updateDocument: (transaction, current, data) => {
		return new Promise(async (resolve, reject) => {
			try {
				/*if (data.type === "email") {
                await mail.template(req.params.transaction, current);
            }
            if (data.type === "sign_in") {
                const userData = await upsert(data.value);
                const documento = await getDocumento(req.params.transaction);
                data.user = userData._id;
                if (userData.type === "new") {
                    await mail.signup({ ...userData, ...documento });
                } else {
                    await mail.newProcedure({ ...userData, ...documento });
                }
			}*/
				const { data: response } = await axios({
					url: `${GESTDOC_URL}api/documento/${transaction}`,
					method: 'put',
					data: {
						data,
						current
					},
					maxContentLength: Infinity,
					maxBodyLength: Infinity
				});
				console.log(response);
				resolve(response);
				/*if (data.type === "signature") {
                if (data.emails) {
                    await asyncForEach(data.emails, async (item) => {
                        await mail.pixel({
                            activity: current,
                            email: item,
                            procedure: req.params.transaction,
                        });
                    });
                } else {
                    await updatePixel(data.value.pixel, {
                        lecture: {
                            host: req.headers.host,
                            params: req.params,
                            query: req.query,
                            agent: req.headers["user-agent"],
                            ip:
                                req.headers["x-forwarded-for"] ||
                                req.connection.remoteAddress,
                        },
                        finalized: true,
                    });
                }
			}*/
			} catch (e) {
				reject(e);
			}
		});
	},
	/**
	 * Funcion para retroceder el documento
	 * @param transaction <ObjectId> ID de la transacción
	 * @param data <Object> Información a ser actualizada
	 * @param current <String> Paso actual de la transacción
	 * @param participant <String> Gestor actual
	 */
	backDocument: (transaction, current, activity, participant, current_name = '', vence = 0) => {
		return new Promise(async (resolve, reject) => {
			try {
				if (isNaN(vence)) vence = 0;
				const { data: response } = await axios.put(`${GESTDOC_URL}api/documento/back/${transaction}`, {
					current,
					activity,
					participant,
					current_name,
					vence
				});
				resolve(response);
			} catch (e) {
				reject(e);
			}
		});
	}
};
