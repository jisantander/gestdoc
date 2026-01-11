//Dependencias
var Docxtemplater = require('docxtemplater');
var async = require('async');
var AWS = require('aws-sdk');
var PizZip = require('pizzip');
const xml2js = require('../lib/xml2js');
const fs = require('fs').promises;
const asyncForEach = require('../lib/asyncForEach');
const noSyncfs = require('fs');

const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

AWS.config.update({
	accessKeyId: S3_KEY,
	secretAccessKey: S3_SECRET,
	region: S3_REGION,
});

const findDoc = async (id) => {
	debugger;
	const { _bpmnModeler, _requirements, ...documento } = await bpmnModel.findOne(
		id
	);
	const xmlBpmn = await xml2js(_bpmnModeler);
	const participants = [];
	await asyncForEach(
		xmlBpmn['bpmn:definitions']['bpmn:collaboration'][0]['bpmn:participant'],
		async (it) => {
			const partiData = it['$'];
			const processNode = xmlBpmn['bpmn:definitions']['bpmn:process'].find(
				(itp) => {
					return itp['$'].id === partiData.processRef;
				}
			);
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
		}
	);
	return { _valor: 10000, participants, ...documento };
};

const findDoc = async (id) => {
	debugger;
	const { _bpmnModeler, _requirements, ...documento } = await bpmnModel.findOne(
		id
	);
	const xmlBpmn = await xml2js(_bpmnModeler);
	const participants = [];
	await asyncForEach(
		xmlBpmn['bpmn:definitions']['bpmn:collaboration'][0]['bpmn:participant'],
		async (it) => {
			const partiData = it['$'];
			const processNode = xmlBpmn['bpmn:definitions']['bpmn:process'].find(
				(itp) => {
					return itp['$'].id === partiData.processRef;
				}
			);
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
		}
	);
	return { _valor: 10000, participants, ...documento };
};

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

function resultTemplate(id_operation) {
	return new Promise((resolve, reject) => {
		proceduresModel.findOne({ _id: id_operation }, function (err, operation) {
			//busco los resultados de la operacion
			if (err) return reject(err);

			findDoc({ _id: operation.bpmn })
				.then((infoDoc) => {
					//busco algún doc asociado a la operación

					var s3 = new AWS.S3();
					const nameDocx = infoDoc.participants[0].doc._key; //string del nombre del doc
					const namePdf = infoDoc.participants[0].doc._key.replace(
						'docx',
						'pdf'
					);
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

module.exports = {
	/*
	 * GET
	 * router.get('/getdocs/:id', operationController.resultTemplateGestDocExpress);
	 */
	resultTemplateGestDocExpress: async function (req, res) {
		var id = req.params.id; // procedures_id
		try {
			var documents = await resultTemplate(id);
			/**
			 *TENER INSTALADO unoconv EN EL SISTEMA.
			 * */
			await exec(
				'unoconv -f pdf ' + `${__dirname}/../unoconv/` + documents.nameDocx
			); //comando cmd para crear pdf

			var file = noSyncfs.createReadStream(
				`${__dirname}/../unoconv/` + documents.namePdf
			);

			const params = {
				Bucket: S3_BUCKET,
				Key: `${id}.pdf`,
				Body: file,
			};
			var s3 = new AWS.S3();
			s3.upload(params, (error, data) => {
				if (error) {
					res.status(500).send(error);
				}
				var file = noSyncfs.createReadStream(
					`${__dirname}/../unoconv/` + documents.namePdf
				);
				var stat = noSyncfs.statSync(
					`${__dirname}/../unoconv/` + documents.namePdf
				);
				res.setHeader('Content-Length', stat.size);
				res.setHeader('Content-Type', 'application/pdf');
				res.setHeader(
					'Content-Disposition',
					'inline; filename=' + documents.namePdf
				);
				file.pipe(res); // aquí se envía el archivo al cliente
				deleteFiles(documents.namePdf, documents.nameDocx);
			});
		} catch (error) {
			console.log('error', error);
			res.status(error);
			return res.send(error.message);
		}
	},

	//Metodo para buscar el documento pdf

	/*
	 * GET
	 * router.get('/fileSign/:id', operationController.docxQr);
	 */

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

				const ticketId =
					'http://gestdoc-express.herokuapp.com/signaturedoc/' + id;
				QRCode.toString(ticketId, {
					type: 'svg',
					version: 8,
					errorCorrectionLevel: 'H',
				}).then(async (out) => {
					// Draw the SVG path at 50% of its original size

					var svgresolve = out.split('stroke="#000000" d="');

					var svgresolve2 = svgresolve[1].split('"/></');
					pages[0].drawText('Firma Simple Gestdoc Express', {
						x: 20,
						y: 80,
						size: 11,
					});

					pages[0].moveTo(10, pages[0].getHeight() - 5);
					pages[0].moveDown(600);
					pages[0].drawSvgPath(svgresolve2[0], { scale: 2.5 });
					const pdfBytes = await pdfDoc.save();
					var pdfBuffer = Buffer.from(pdfBytes.buffer, 'binary');

					res.status(200);
					res.type('pdf');
					res.send(pdfBuffer);
				});
			} catch (error) {}
		});
	},
};
