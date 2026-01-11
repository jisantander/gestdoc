const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AWS = require('aws-sdk');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const writtenNumber = require('written-number');
const moment = require('moment');

const modelProcedure = require('../models/procedureModel');
const modelDocs = require('../models/themedocModel');

function angularParser(tag) {
	if (tag === '.') {
		return {
			get: function (s) {
				return s;
			},
		};
	}
	if (tag.substring(0, 3) === 'nl ') {
		return {
			get: function (scope) {
				return writtenNumber(scope[tag.substring(3)], { lang: 'es' });
			},
		};
	}
	if (tag.substring(0, 3) === 'nm ') {
		return {
			get: function (scope) {
				return new Intl.NumberFormat('es-CL').format(scope[tag.substring(3)]);
			},
		};
	}
	return {
		get: function (scope) {
			if(typeof scope[tag] === 'boolean' && scope[tag] !== null){
				if(scope[tag]===true) scope[tag] = '!';
				else delete scope[tag];
			}
			if (scope[tag])
				if (
					scope[tag].match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
				) {
					var fecha = moment(scope[tag]).toDate();
					return fecha.toLocaleDateString('es-ES', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					});
				}
			return scope[tag];
		},
	};
}
// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
const replaceErrors = (key, value) => {
	if (value instanceof Error) {
		return Object.getOwnPropertyNames(value).reduce(function (error, key) {
			error[key] = value[key];
			return error;
		}, {});
	}
	return value;
};

const errorHandler = (error) => {
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
};

module.exports = (transactionId, docId) => {
	return new Promise(async (resolve, reject) => {
		try {
			/* Configuramos AWS para S3 */
			AWS.config.update({
				accessKeyId: process.env.S3_KEY,
				secretAccessKey: process.env.S3_SECRET,
				region: process.env.S3_REGION,
			});

			/* Obtenemos el procedimiento correspondiente */
			const procedure = await modelProcedure.getDocumento(transactionId, false);
			/* Obtenemos la data de email del bpmn */
			const docTemplate = await modelDocs.findById(docId);
			const nameDocx = docTemplate._key;

			/* Obtenemos la plantilla desde S3 */
			const s3 = new AWS.S3();
			s3.getObject(
				{
					Bucket: process.env.S3_BUCKET,
					Key: nameDocx,
				},
				async (err, file) => {
					if (err) {
						reject({ message: 'Archivo no encontrado en S3' });
					}
					try {
						const templateFile = file.Body;
						let resultForms = {};
						procedure.gestores.forEach((element) => {
							resultForms = { ...resultForms, ...element.form };
						});

						const zip = new PizZip(templateFile);
						let doc2;
						try {
							doc2 = new Docxtemplater(zip, { parser: angularParser });
						} catch (error) {
							errorHandler(error);
							reject(error);
						}

						doc2.setData(resultForms);

						try {
							doc2.render();
						} catch (error) {
							errorHandler(error);
							reject(error);
						}
						const buf = await doc2.getZip().generate({ type: 'nodebuffer' });

						const namePdf = `${transactionId}-${nameDocx.replace(
							'.docx',
							'.pdf'
						)}`;
						const pathDocxTemp = path.join(
							__dirname,
							'../temp',
							`${transactionId}-${nameDocx}`
						);
						const pathPdfTemp = path.join(__dirname, '../temp', `${namePdf}`);
						fs.writeFile(pathDocxTemp, buf, async (err, data) => {
							if (err) reject(err);

							/* Convertimos el documento DOCX a PDF */
							exec(
								`unoconv -f pdf ${pathDocxTemp}`,
								(error, stdout, stderr) => {
									if (error) {
										reject(error);
									}
									/* Obtenemos el buffed del PDF */
									const filePdf = fs.createReadStream(pathPdfTemp);
									console.log(process.env.S3_BUCKET, namePdf);
									s3.upload(
										{
											Bucket: process.env.S3_BUCKET,
											Key: namePdf,
											Body: filePdf,
										},
										async (error, data) => {
											if (error) {
												reject(error);
											}
											console.log(data);
											/* Obtenemos metadata y buffer de pdf temporal */
											const file = fs.createReadStream(pathPdfTemp);
											const stat = fs.statSync(pathPdfTemp);
											/* Eliminamos los archivos temporales */
											exec(`rm ${pathDocxTemp} ${pathPdfTemp}`);
											resolve({
												stat,
												file,
												name: namePdf,
											});
										}
									);
								}
							);
						});
					} catch (e) {
						reject(e);
					}
				}
			);
		} catch (e) {
			reject(e);
		}
	});
};
